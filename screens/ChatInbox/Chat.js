import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  getAuthenticatedUserId,
} from "../../firebase";

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};

const Chat = ({ route }) => {
  const { userDetail } = route.params;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userUID = FIREBASE_AUTH.currentUser.uid;

  useEffect(() => {
    console.log("Personal Chat", userDetail);
    const q = query(
      collection(FIREBASE_FIRESTORE, "Chats"),
      where("participants", "array-contains", userUID, userDetail.id),
      where("sender", "==", userUID), // Include only chats where the current user is the sender
      where("recipient", "==", userDetail.id) // Include only chats where recipient is the recipient's user ID
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setChatMessages(messages);
    });

    return () => unsubscribe();
  }, [userUID, userDetail.id]);

  const sendMessage = async () => {
    userSnap = await getDoc(doc(FIREBASE_FIRESTORE, "Users", userUID));
    if (message.trim() !== "") {
      await addDoc(collection(FIREBASE_FIRESTORE, "Chats"), {
        message: message,
        sender: userUID,
        senderUsername: userSnap.data().username,
        recipient: userDetail.id,
        participants: [userUID, userDetail.id],
        timestamp: new Date(),
      });
      setMessage("");
    }
  };

  const renderChatMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === userUID ? styles.senderMsg : styles.recipientMsg,
      ]}
    >
      <Text style={styles.sender}>{item.senderUsername}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.senderID}>
        {userDetail.username} -- {userDetail.bio}
      </Text>
      <FlatList
        data={chatMessages}
        renderItem={renderChatMessage}
        keyExtractor={(item) => item.timestamp.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageContainer: {
    padding: 8,
    maxWidth: "80%", // Adjust as needed
    borderRadius: 8,
    marginVertical: 8,
  },
  senderID: {
    fontSize: 20,
    color: colors.secondary,
    fontFamily: "Pacifico",
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderBottomColor: colors.accent,
  },
  sender: {
    color: "#FFD700",
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  sendButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFD700",
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#242038",
    fontSize: 16,
    fontWeight: "bold",
  },
  senderMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#9067C6", // Example color for sender's message
    marginRight: 16, // Adjust as needed
  },
  recipientMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#242038", // Example color for recipient's message
    marginLeft: 16, // Adjust as needed
  },
});

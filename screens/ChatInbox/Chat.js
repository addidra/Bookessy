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
  serverTimestamp,
} from "firebase/firestore";
import {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  getAuthenticatedUserId,
} from "../../firebase";
import colors from "../../colors";

const Chat = ({ route }) => {
  const { userDetail } = route.params;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userUID = FIREBASE_AUTH.currentUser.uid;

  // Functions
  const sendMessage = async () => {
    let localMessage = message;
    setMessage("");
    userSnap = await getDoc(doc(FIREBASE_FIRESTORE, "Users", userUID));
    if (localMessage.trim() !== "") {
      await addDoc(collection(FIREBASE_FIRESTORE, "Chats"), {
        message: localMessage,
        timestamp: serverTimestamp(),
        senderUsername: userSnap.data().username,
        participants: [userUID, userDetail.id],
        sender: userUID,
        recipient: userDetail.id,
      });
    }
  };

  // Effects
  useEffect(() => {
    console.log("Personal Chat", userDetail);
    const q = query(
      collection(FIREBASE_FIRESTORE, "Chats"),
      where("participants", "array-contains", userUID),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.participants.includes(userDetail.id))
          messages.push({ id: doc.id, ...doc.data() });
      });
      setChatMessages(messages);
    });

    return () => unsubscribe();
  }, [userUID, userDetail.id]);

  // Components
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
        keyExtractor={(item) => item.id}
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
    backgroundColor: colors.primary,
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
    color: colors.highlight,
    fontFamily: "Pacifico",
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderBottomColor: colors.accent,
  },
  sender: {
    color: colors.highlight,
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
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
    backgroundColor: colors.accent,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  senderMsg: {
    alignSelf: "flex-end",
    backgroundColor: colors.secondary, // Example color for sender's message
    borderWidth: 1,
    marginRight: 12, // Adjust as needed
  },
  recipientMsg: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent, // Example color for recipient's message
    borderWidth: 1,
    marginLeft: 12, // Adjust as needed
  },
});

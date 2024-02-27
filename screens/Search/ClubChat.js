import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../colors";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from "../../firebase";
const ClubChat = ({ route }) => {
  // States
  const { clubData } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
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
        serderUsername: userSnap.data().username,
        room: clubData.name,
        sender: userUID,
      });
    }
  };

  // Effects
  useEffect(() => {
    const q = query(
      collection(FIREBASE_FIRESTORE, "Chats"),
      where("room", "==", clubData.name),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      setChatMessages(messages);
    });
    return () => unsubscribe();
  }, [clubData, userUID]);

  //Compoenents
  const renderChatMessage = ({ item }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === userUID ? styles.senderMsg : styles.recipientMsg,
        ]}
      >
        <Text style={styles.sender}>{item.serderUsername}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.senderID}>{clubData.name}</Text>
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
    </View>
  );
};

export default ClubChat;

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

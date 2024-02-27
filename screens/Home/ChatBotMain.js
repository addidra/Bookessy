import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { dummyMessages } from "./constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../colors";
import { apiCall } from "../../openAI";
import Toast from "react-native-toast-message";
const ChatBotMain = () => {
  // States
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // Functions
  const sendPrompt = () => {
    if (prompt.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({ role: "user", content: prompt.trim() });
      setMessages([...newMessages]);
      setLoading(true);
      apiCall(prompt.trim(), newMessages).then((res) => {
        console.log("got api data: ", res);
        if (res.success) {
          setMessages([...res.data]);
          setPrompt("");
        } else {
          Toast.show({
            type: "error",
            text1: "Too many reques or low network",
            text2: res.msg,
          });
        }
        setLoading(false);
      });
    }
  };
  // Effects

  // Components
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <MaterialCommunityIcons
          name="robot-excited"
          size={64}
          color={colors.highlight}
          style={{ alignSelf: "center" }}
        />
        <View>
          <View style={styles.chatContainer}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {messages.map((msg, index) => {
                if (msg.role == "assistant") {
                  if (msg.content.includes("https")) {
                    // an ai img
                    return (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          borderRadius: 20,
                          overflow: "hidden", // Ensure that the image stays within the bounds of the container
                        }}
                      >
                        <Image
                          source={{ uri: msg.content }}
                          resizeMode="contain"
                          style={{
                            height: 175,
                            width: "90%",
                            borderRadius: 20,
                          }} // Adjust height as per your requirement
                        />
                      </View>
                    );
                  } else {
                    return (
                      <View
                        style={{
                          marginBottom: 10,
                        }}
                        key={index}
                      >
                        <View
                          style={{
                            width: "70%",
                            backgroundColor: "red",
                            borderRadius: 20,
                            padding: 7,
                          }}
                        >
                          <Text style={styles.bold}>{msg.content}</Text>
                        </View>
                      </View>
                    );
                  }
                } else {
                  //user input
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginBottom: 10,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          width: "70%",
                          backgroundColor: "pink",
                          borderRadius: 20,
                          padding: 7,
                        }}
                      >
                        <Text style={styles.bold}>{msg.content}</Text>
                      </View>
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Text Box */}
      <View style={styles.textInput}>
        <TextInput
          style={styles.input}
          placeholder="Type your Prompt"
          placeholderTextColor="gray"
          value={prompt}
          onChangeText={(text) => setPrompt(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendPrompt}>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatBotMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    // alignItems: "center",
    // justifyContent: "space-between",
    padding: 20,
  },
  chatContainer: {
    backgroundColor: "gray",
    opacity: 1,
    height: 600,
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "800",
    fontSize: 15,
  },
  textInput: { flexDirection: "row", alignItems: "center" },
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
    color: "#242038",
    fontSize: 16,
    fontWeight: "bold",
  },
});

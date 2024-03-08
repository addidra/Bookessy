import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../colors";
import Toast from "react-native-toast-message";
import axios from "axios";
const ChatBotMain = () => {
  // States

  const [messages, setMessages] = useState([
    {
      category: "",
      role: "assistant",
      content: {
        summary: "Hey! What kind of club are you looking for? ",
        book: "",
        achievement: "",
      },
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // Functions
  // const sendPrompt = () => {
  //   if (prompt.trim().length > 0) {
  //     let newMessages = [...messages];
  //     newMessages.push({ role: "user", content: prompt.trim() });
  //     setMessages([...newMessages]);
  //     setLoading(true);
  //     apiCall(prompt.trim(), newMessages).then((res) => {
  //       console.log("got api data: ", res);
  //       if (res.success) {
  //         setMessages([...res.data]);
  //         setPrompt("");
  //       } else {
  //         Toast.show({
  //           type: "error",
  //           text1: "Too many reques or low network",
  //           text2: res.msg,
  //         });
  //       }
  //       setLoading(false);
  //     });
  //   }
  // };

  const sendRequest = async () => {
    let newMessages = [...messages];
    newMessages.push({ role: "user", content: prompt.trim() });
    setPrompt("");
    setMessages([...newMessages]);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.219.174:1024/predict_club_suggestions",
        {
          user_prompt: prompt,
        }
      );
      if (response.data.status === "success") {
        setMessages([...newMessages, response.data]);
      } else {
        setMessages([...newMessages, response.data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  // Components
  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <MaterialCommunityIcons
          name="robot-excited"
          size={34}
          color={colors.highlight}
          style={{ alignSelf: "center" }}
        />
        <View>
          <View style={styles.chatContainer}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {messages.map((msg, index) => {
                if (msg.role == "assistant") {
                  return (
                    <View
                      style={{
                        marginBottom: 10,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          width: "85%",
                          backgroundColor: colors.highlight,
                          borderRadius: 20,
                          padding: 10,
                          rowGap: 10,
                        }}
                      >
                        {msg.category && (
                          <>
                            <Text style={{ color: colors.secondary }}>
                              Club you would like to visit:
                            </Text>
                            <Text
                              style={[
                                styles.bold,
                                {
                                  color: colors.secondary,
                                  fontSize: 30,
                                },
                              ]}
                            >
                              {msg.category}
                            </Text>
                          </>
                        )}
                        <Text
                          style={{
                            color: colors.secondary,
                          }}
                        >
                          {msg.content.summary}
                        </Text>
                        {msg.category && (
                          <>
                            <Text
                              style={[styles.bold, { color: colors.secondary }]}
                            >
                              Top Books
                            </Text>
                            <Text
                              style={{
                                color: colors.secondary,
                              }}
                            >
                              {msg.content.book}
                            </Text>
                            <Text
                              style={{
                                color: colors.secondary,
                              }}
                            >
                              {msg.content.achievement}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  );
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
                          backgroundColor: colors.secondary,
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
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendRequest}
          // onPress={sendPrompt}
        >
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
    height: 650,
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

import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { dummyMessages } from "./constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../colors";

const ChatBotMain = () => {
  const [messages, setMessages] = useState(dummyMessages);
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="robot-excited"
        size={64}
        color={colors.secondary}
        style={{ alignSelf: "center" }}
      />
      {messages.length > 0 ? (
        <View>
          <Text style={{ fontSize: 35, color: colors.secondary }}>
            Assistant
          </Text>
          <View style={styles.chatContainer}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {messages.map((msg, index) => {
                if (msg.role == "assistant") {
                  if (msg.content.includes("https")) {
                    // an ai img
                  } else {
                    // text response
                  }
                } else {
                  //user input
                }
              })}
            </ScrollView>
          </View>
        </View>
      ) : (
        <></>
      )}
      {/* <FontAwesome name="microphone" size={44} color="pink" /> */}
    </View>
  );
};

export default ChatBotMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    // alignItems: "center",
    // justifyContent: "space-between",
    padding: 20,
  },
  chatContainer: {
    backgroundColor: "gray",
    opacity: 0.4,
    height: "75%",
    borderRadius: 20,
    padding: 10,
  },
});

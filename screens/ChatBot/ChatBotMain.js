import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ChatBotMain = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "pink" }}>ChatBotMain</Text>
    </View>
  );
};

export default ChatBotMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    alignItems: "center",
    justifyContent: "center",
  },
});

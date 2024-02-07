import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: "#f7ece1" }}>Chat Screen</Text>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    alignItems: "center",
    justifyContent: "center",
  },
});

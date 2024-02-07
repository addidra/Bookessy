import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";
import { FIREBASE_AUTH } from "../../firebase";

const UserProfile = () => {
  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: "#f7ece1" }}>UserProfile</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    alignItems: "center",
    justifyContent: "center",
  },
});

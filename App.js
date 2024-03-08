import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import React, { useState } from "react";
import { LogBox, Text } from "react-native";
import Navigation from "./Navigation";
import Toast from "react-native-toast-message";

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <>
      <Navigation />
      <Toast />
    </>
  );
};

export default App;

import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import React, { useState } from "react";
import { LogBox, Text } from "react-native";
import Navigation from "./Navigation";
import Toast from "react-native-toast-message";

const colors = {
  primary: "#242038",
  secondary: "#e4d5b7",
  accent: "#FF7F50",
  primary1: "#00008B",
  secondary1: "#EFE0CD",
  accent1: "#800020",
};

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

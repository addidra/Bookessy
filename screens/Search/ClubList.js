import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const ClubList = ({ data }) => {
  return (
    <TouchableOpacity style={styles.club}>
      <Text style={{ color: "#e4d5b7", fontSize: 44 }}>{data.name}</Text>
      <Text style={{ color: "pink" }}>{data.description}</Text>
    </TouchableOpacity>
  );
};

export default ClubList;

const styles = StyleSheet.create({
  club: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 15,
    margin: 5,
  },
});

import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};

const AddPost = () => {
  // State variables to store user inputs
  const [quote, setQuote] = useState("");
  const [comment, setComment] = useState("");
  const [selectedClub, setSelectedClub] = useState("");

  // Dummy list of clubs for demonstration
  const clubs = ["Club A", "Club B", "Club C", "Club D"];

  // Function to handle form submission
  const handleSubmit = () => {
    // Logic to handle form submission
    console.log("Quote:", quote);
    console.log("Comment:", comment);
    console.log("Selected Club:", selectedClub);
    // Further logic to submit data to backend/database
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Quote from Book"
        value={quote}
        onChangeText={(text) => setQuote(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Additional Comment"
        value={comment}
        onChangeText={(text) => setComment(text)}
      />
      {/* <Picker
        selectedValue={selectedClub}
        onValueChange={(itemValue) => setSelectedClub(itemValue)}
      >
        <Picker.Item label="Select Club" value="" />
        {clubs.map((club, index) => (
          <Picker.Item key={index} label={club} value={club} />
        ))}
      </Picker> */}
      <Picker
        selectedValue={selectedClub}
        onValueChange={(itemValue, itemIndex) => setSelectedClub(itemValue)}
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#f7ece1",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddPost;

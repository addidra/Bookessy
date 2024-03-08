import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import { FIREBASE_APP, FIREBASE_AUTH } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import colors from "../../colors";

const RegistrationScreen = () => {
  useFonts({
    Pacifico: require("../../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleNext = () => {
    if (email == "" || password == "" || username == "" || bio == "") {
      Toast.show({
        type: "error",
        text1: "Enter all detail",
      });
      return;
    }
    const userInfo = {
      email: email,
      password: password,
      username: username,
      bio: bio,
      homies: [],
    };
    navigation.navigate("FavClub", { userInfo });
  };
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.logo}>Bookessy</Text>

        <Text style={styles.text}>Register</Text>
        {/* Login Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Set New Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            multiline={true}
            numberOfLines={7}
            style={styles.inputbio}
            placeholder="Little about yourself"
            value={bio}
            onChangeText={(text) => setBio(text)}
          />
        </View>

        <TouchableHighlight style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 300,
  },
  text: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  logo: {
    color: colors.highlight,
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 40,
    fontFamily: "Pacifico",
  },
  formContainer: {
    width: "100vw",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: colors.accent,
    marginVertical: 30,
  },
  registrationText: {
    width: "2px",
    color: colors.accent,
    fontSize: 16,
    marginVertical: -12,
    textAlign: "center",
  },
  inputbio: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

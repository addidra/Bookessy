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

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};

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
            placeholderTextColor={colors.secondary}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            placeholderTextColor={colors.secondary}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Set New Password"
            secureTextEntry
            value={password}
            placeholderTextColor={colors.secondary}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.inputbio}
            placeholder="Little about yourself"
            value={bio}
            placeholderTextColor={colors.secondary}
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
    color: colors.secondary,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  logo: {
    color: "yellow",
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Pacifico",
  },
  formContainer: {
    width: "100vw",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: colors.secondary,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary,
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
    height: 80,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: colors.secondary,
  },
});

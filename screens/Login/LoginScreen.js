import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { TouchableHighlight } from "react-native";
import { useFonts } from "expo-font";
import { FIREBASE_AUTH } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";

import colors from "../../colors";

const LoginScreen = () => {
  const [loaded] = useFonts({
    Pacifico: require("../../assets/fonts/Pacifico-Regular.ttf"),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    if (email == "" || password == "") {
      Toast.show({
        type: "error",
        text1: "Enter all detail",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res);
      Toast.show({
        type: "success",
        text1: "Logged in Succesfully",
        text2: `Welcome ${email}`,
      });
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        Toast.show({ type: "error", text1: "Invalid Login Details" });
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toRegister = () => {
    navigation.navigate("Registration");
  };
  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.parentContainer}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.container}>
          <Text style={styles.logo}>Bookessy</Text>
          <Text style={styles.text}>Login</Text>
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
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          {/* Login Button */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.highlight} />
          ) : (
            <TouchableHighlight style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableHighlight>
          )}
          {/* Divider */}
          <View style={styles.divider} />
          <TouchableOpacity onPress={toRegister}>
            <Text style={styles.registrationText}>
              New to the Bookessy? Click here
            </Text>
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
    borderWidth: 2,
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
});

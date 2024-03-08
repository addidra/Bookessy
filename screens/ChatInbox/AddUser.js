import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import {
  FIREBASE_FIRESTORE,
  getDocs,
  collection,
  FIREBASE_AUTH,
  getAuthenticatedUserId,
  getDoc,
  doc,
  updateDoc,
} from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import colors from "../../colors";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { arrayRemove, arrayUnion, query, where } from "firebase/firestore";
import FlatListUser from "./FlatListUser";

const AddUser = () => {
  // States
  const userUID = FIREBASE_AUTH.currentUser.uid;
  const navigation = useNavigation();
  const [userList, setUserList] = useState(null);
  const [filteredUserList, setFilteredUserList] = useState();
  const searchRef = useRef();
  const [searchFocus, setSearchFocus] = useState(false);
  const [homieFlag, setHomieFlag] = useState(false);

  // Functions

  const onSearch = (txt) => {
    if (txt === "") {
      setFilteredUserList(userList);
    } else {
      let tempData = userList.filter((item) =>
        item.username.toLowerCase().includes(txt.toLowerCase())
      );
      setFilteredUserList(tempData);
    }
  };

  const getUserList = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, "Users")
      );
      let userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
      userList = userList.filter((user) => user.id !== userUID);
      setUserList(userList);
      setFilteredUserList(userList);
    } catch (err) {
      console.log("What the fucking hell: ", err);
    }
  };

  // Effects
  useEffect(() => {
    getUserList();
  }, []);

  // Components

  if (userList === null) {
    return (
      <ActivityIndicator
        size={54}
        color={colors.highlight}
        style={{
          justifyContent: "center",
          backgroundColor: colors.primary,
          alignItems: "center",
          flex: 1,
        }}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        ref={searchRef}
        placeholder="Search for your Homies"
        placeholderTextColor="gray"
        style={[styles.searchInput, searchFocus && styles.searchFocus]}
        onFocus={() => setSearchFocus(true)}
        onBlur={() => setSearchFocus(false)}
        onChangeText={(txt) => onSearch(txt)}
      />
      <FlatList
        data={filteredUserList}
        renderItem={({ item }) => <FlatListUser item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  searchInput: {
    color: "white",
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  user: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
  searchFocus: {
    color: "white",
    width: "100%",
    height: 60,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  noHomie: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 30,
    fontWeight: "bold",
    color: colors.accent,
  },
  addIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
});

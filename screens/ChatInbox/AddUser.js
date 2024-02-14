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
  getAuthenticatedUserId,
  getDoc,
  doc,
  updateDoc,
} from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import colors from "../../colors";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { arrayRemove, arrayUnion } from "firebase/firestore";

const AddUser = () => {
  // States
  const userUID = getAuthenticatedUserId();
  const navigation = useNavigation();
  const [userList, setUserList] = useState();
  const [filteredUserList, setFilteredUserList] = useState();
  const searchRef = useRef();
  const [searchFocus, setSearchFocus] = useState(false);
  const [homieFlag, setHomieFlag] = useState(false);
  // Functions

  const addFriend = async (id) => {
    try {
      if (homieFlag) {
        setHomieFlag(false);
        await updateDoc(doc(FIREBASE_FIRESTORE, "Users", userUID), {
          homies: arrayRemove(id),
        });
        await updateDoc(doc(FIREBASE_FIRESTORE, "Users", id), {
          homies: arrayRemove(userUID),
        });
      } else {
        setHomieFlag(true);
        await updateDoc(doc(FIREBASE_FIRESTORE, "Users", userUID), {
          homies: arrayUnion(id),
        });
        await updateDoc(doc(FIREBASE_FIRESTORE, "Users", id), {
          homies: arrayUnion(userUID),
        });
      }
    } catch (error) {}
  };

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
      console.log("this is the getUserList Error: ", err);
    }
  };

  // Effects
  useEffect(() => {
    getUserList();
  }, []);
  // Components

  const renderUser = ({ item }) => {
    return (
      <View style={styles.user}>
        <TouchableOpacity style={{ flex: 1 }}>
          <Text style={{ color: "#e4d5b7", fontSize: 44 }}>
            {item.username}
          </Text>
          <Text style={{ color: "pink" }}>{item.bio}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addFriend(item.id)}>
          {homieFlag ? (
            <FontAwesome5
              name="handshake-slash"
              size={35}
              color={colors.secondary}
            />
          ) : (
            <FontAwesome5 name="handshake" size={35} color={colors.secondary} />
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="chat" size={35} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  if (userList === null) {
    return (
      <ActivityIndicator
        size={54}
        color="0000ff"
        style={{
          justifyContent: "center",
          backgroundColor: "#242038",
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
        renderItem={renderUser}
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
    backgroundColor: "#242038",
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

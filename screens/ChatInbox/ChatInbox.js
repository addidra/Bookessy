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
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FIREBASE_FIRESTORE,
  getDocs,
  collection,
  getAuthenticatedUserId,
  getDoc,
  doc,
  FIREBASE_AUTH,
} from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import colors from "../../colors";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const ChatInbox = () => {
  const userUID = FIREBASE_AUTH.currentUser.uid;
  const navigation = useNavigation();
  const [userList, setUserList] = useState(null);
  const [filteredUserList, setFilteredUserList] = useState();
  const searchRef = useRef();
  const [searchFocus, setSearchFocus] = useState(false);
  const [homies, setHomies] = useState();
  const [filteredHomies, setFilteredHomies] = useState();

  // Functions
  const onSearch = (txt) => {
    if (txt === "") {
      setFilteredHomies(homies);
    } else {
      let tempData = homies.filter((item) =>
        item.username.toLowerCase().includes(txt.toLowerCase())
      );
      setFilteredHomies(tempData);
    }
  };

  const getHomieList = async () => {
    try {
      let currentUserDoc = await getDoc(
        doc(FIREBASE_FIRESTORE, "Users", userUID)
      );
      currentUserDoc = { id: currentUserDoc.id, ...currentUserDoc.data() };

      // Fetch user documents for homies
      const homieDocs = [];
      await Promise.all(
        currentUserDoc.homies.map(async (homieId) => {
          const homieDoc = await getDoc(
            doc(FIREBASE_FIRESTORE, "Users", homieId)
          );
          if (homieDoc.exists()) {
            homieDocs.push({ id: homieDoc.id, ...homieDoc.data() });
          }
        })
      );
      setFilteredHomies(homieDocs);
      setHomies(homieDocs);
    } catch (error) {
      console.log("this is the getHomieList Error: ", err);
    }
  };

  useEffect(() => {
    getHomieList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getHomieList();
    }, [])
  );

  if (homies === null) {
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
      {filteredHomies && filteredHomies.length == 0 ? (
        <Text style={styles.noHomie}>You Have No Homies</Text>
      ) : (
        <FlatList
          data={filteredHomies}
          renderItem={({ item }) => {
            return (
              <View style={styles.user}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PersonalChat", { userDetail: item });
                  }}
                >
                  <Text style={{ color: colors.highlight, fontSize: 44 }}>
                    {item.username}
                  </Text>
                  <Text>{item.bio}</Text>
                </TouchableOpacity>
                <Feather
                  name="info"
                  size={35}
                  color={colors.accent}
                  onPress={() => {
                    navigation.navigate("UserInfoScreen", {
                      userDetail: item,
                    });
                  }}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => {
          navigation.navigate("AddUserScreen");
        }}
      >
        <AntDesign name="adduser" size={34} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatInbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  searchInput: {
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
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchFocus: {
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

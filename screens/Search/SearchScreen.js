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
import ClubList from "./ClubList";
import DUMMY_DATA from "../../DUMMY_DATA";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FIREBASE_FIRESTORE, getDocs, collection } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import colors from "../../colors";
const SearchScreen = () => {
  const navigation = useNavigation();
  const [clubList, setClubList] = useState(null);
  const [filteredClubList, setFilteredClubList] = useState();
  const searchRef = useRef();
  const [searchFocus, setSearchFocus] = useState(false);

  // Functions
  const onSearch = (txt) => {
    if (txt === "") {
      setFilteredClubList(clubList);
    } else {
      let tempData = clubList.filter((item) =>
        item.name.toLowerCase().includes(txt.toLowerCase())
      );
      setFilteredClubList(tempData);
    }
  };

  const getClubsList = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, "clubs")
      );
      const clubList = [];
      querySnapshot.forEach((doc) => {
        clubList.push({ id: doc.id, ...doc.data() });
      });
      setClubList(clubList);
      setFilteredClubList(clubList);
    } catch (err) {
      console.log("this is the getClubList Error: ", err);
    }
  };

  useEffect(() => {
    getClubsList();
  }, []);

  if (clubList === null) {
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
        placeholder="Search"
        placeholderTextColor="gray"
        style={[styles.searchInput, searchFocus && styles.searchFocus]}
        onFocus={() => setSearchFocus(true)}
        onBlur={() => setSearchFocus(false)}
        onChangeText={(txt) => onSearch(txt)}
      />
      <FlatList
        data={filteredClubList}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.club}
              onPress={() => {
                navigation.navigate("Club", { clubDetail: item });
              }}
            >
              <Text style={{ color: colors.accent, fontSize: 44 }}>
                {item.name}
              </Text>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

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
  club: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 15,
    margin: 5,
  },
  searchFocus: {
    color: "black",
    width: "100%",
    height: 60,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 15,
  },
});

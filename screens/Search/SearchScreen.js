import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClubList from "./ClubList";
import DUMMY_DATA from "../../DUMMY_DATA";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FIREBASE_FIRESTORE, getDocs, collection } from "../../firebase";

const SearchScreen = () => {
  const [clubList, setClubList] = useState(null);

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
      <FlatList
        data={clubList}
        renderItem={({ item }) => <ClubList data={item} />}
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
    backgroundColor: "#242038",
  },
});

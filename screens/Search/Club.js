import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import DUMMY_DATA from "../../DUMMY_DATA";
import { FIREBASE_FIRESTORE, getDoc, doc } from "../../firebase";

const Club = ({ route }) => {
  const { clubDetail } = route.params;
  const [clubData, setClubData] = useState(null);

  // const getClub = async () => {
  //   try {
  //     const docSnap = await getDoc(doc(FIREBASE_FIRESTORE, "clubs", clubId));
  //     console.log("This is specific club || ", docSnap.data());
  //     setClubDetail(docSnap.data());
  //   } catch (error) {
  //     console.log("Error fetching club detail:", error);
  //   }
  // };

  useEffect(() => {
    setClubData(clubDetail);
  }, []);

  return (
    <View style={styles.test}>
      {clubData ? (
        <Text style={{ color: "white" }}>
          {clubData.name} {clubData.description}
        </Text>
      ) : (
        <ActivityIndicator size={54} color="0000ff" />
      )}
    </View>
  );
};

export default Club;

const styles = StyleSheet.create({
  test: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#242038",
  },
});

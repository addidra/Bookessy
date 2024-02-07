import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import {
  FIREBASE_FIRESTORE,
  getDocs,
  collection,
  FIREBASE_AUTH,
  addDoc,
} from "../../firebase";
import ClubList from "../Search/ClubList";
import { createUserWithEmailAndPassword } from "firebase/auth";

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};

const MoreDetail = ({ route }) => {
  // Object definition
  const auth = FIREBASE_AUTH;

  // States
  const { userInfo } = route.params;
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [clubList, setClubList] = useState(null);
  const [loading, setLoading] = useState();

  // Functions
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

  const toggleClubSelection = (clubId) => {
    const isSelected = selectedClubs.includes(clubId);
    if (isSelected) {
      setSelectedClubs(selectedClubs.filter((id) => id !== clubId));
    } else {
      setSelectedClubs([...selectedClubs, clubId]);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Authentication
      const res = await createUserWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.password
      );

      // Adding user into the database
      delete userInfo.password;
      userInfo.clubsFollowing = selectedClubs;
      await addDoc(collection(FIREBASE_FIRESTORE, "Users"), {
        uid: res.user.uid,
        ...userInfo,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    getClubsList();
    console.log(clubList);
  }, []);

  useEffect(() => {
    console.log(selectedClubs);
  }, [selectedClubs]);

  // Template
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
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>Select Your Favorite Clubs:</Text>
      {clubList.map((club) => (
        <TouchableOpacity
          key={club.id}
          style={styles.checkboxContainer}
          onPress={() => toggleClubSelection(club.id)}
        >
          <View style={styles.checkbox}>
            {selectedClubs.includes(club.id) && <View style={styles.checked} />}
          </View>
          <Text style={styles.label}>{club.name}</Text>
        </TouchableOpacity>
      ))}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableHighlight style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableHighlight>
      )}
    </SafeAreaView>
  );
};

export default MoreDetail;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#242038",
    paddingVertical: 20,
    paddingHorizontal: 10,
    rowGap: 5,
  },
  header: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    color: "white",
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
});

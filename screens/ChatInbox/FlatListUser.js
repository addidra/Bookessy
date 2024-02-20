import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../colors";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import {
  FIREBASE_FIRESTORE,
  updateDoc,
  doc,
  FIREBASE_AUTH,
} from "../../firebase";
import {
  arrayRemove,
  arrayUnion,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuthenticatedUserId } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const FlatListUser = ({ item }) => {
  const navigation = useNavigation();
  const userUID = FIREBASE_AUTH.currentUser.uid;
  const [homieFlag, setHomieFlag] = useState(false);
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

  useEffect(() => {
    if (item.homies.includes(userUID)) {
      setHomieFlag(true);
    } else {
      setHomieFlag(false);
    }
  }, []);

  return (
    <View style={styles.user}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          navigation.navigate("UserInfoScreen", { userDetail: item });
        }}
      >
        <Text style={{ color: "#e4d5b7", fontSize: 44 }}>{item.username}</Text>
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

export default FlatListUser;

const styles = StyleSheet.create({
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
});

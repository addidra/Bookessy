import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  onAuthStateChanged,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  getAuthenticatedUserId,
} from "../../firebase";
import Feed from "../Home/Feed";

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};
const UserInfo = ({ route }) => {
  const { userDetail } = route.params;
  const user = userDetail;
  const [homieFlag, setHomieFlag] = useState(false);
  const [posts, setPosts] = useState(null);
  const userUID = FIREBASE_AUTH.currentUser.uid;

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

  const getPosts = async () => {
    try {
      if (user && user.id) {
        const postRef = collection(FIREBASE_FIRESTORE, "Posts");
        const querySnapshot = await getDocs(
          query(postRef, where("userID", "==", user.id))
        );
        const posts = [];
        querySnapshot.forEach((post) => {
          posts.push({ id: post.id, ...post.data() });
        });
        setPosts(posts);
        console.log(posts);
      } else {
        console.log("User ID is undefined.");
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  useEffect(() => {
    if (user) {
      getPosts();
      console.log("this is the post", user.id, posts);
    }
    if (user.homies.includes(userUID)) {
      setHomieFlag(true);
    } else {
      setHomieFlag(false);
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      {posts ? (
        <>
          <View style={styles.upperContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.userBio}>{user.bio}</Text>
            </View>
            <View style={styles.userCount}>
              <Text style={{ color: colors.secondary }}>Homies</Text>
              <Text style={styles.userCount}>{user.homies.length}</Text>
            </View>
            <TouchableOpacity onPress={() => addFriend(user.id)}>
              {homieFlag ? (
                <FontAwesome5
                  name="handshake-slash"
                  size={35}
                  color={colors.secondary}
                />
              ) : (
                <FontAwesome5
                  name="handshake"
                  size={35}
                  color={colors.secondary}
                />
              )}
            </TouchableOpacity>
          </View>
          <FlatList
            data={posts}
            renderItem={({ item }) => <Feed feed_detail={item} />}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<Text style={styles.postTitle}>POSTS</Text>}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <ActivityIndicator size={50} color="blue" />
      )}
    </SafeAreaView>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  upperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 20,
  },
  username: {
    fontSize: 40,
    fontFamily: "Pacifico",
    color: colors.accent,
  },
  logoutBtn: {
    padding: 7,
    color: colors.secondary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  headerDetails: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  userCount: {
    fontSize: 45,
    color: colors.secondary,
    alignSelf: "center",
  },
  userBio: {
    color: colors.secondary,
    fontSize: 15,
    fontStyle: "italic",
    paddingBottom: 10,
  },
  postTitle: {
    fontSize: 20,
    color: colors.accent,
  },
});

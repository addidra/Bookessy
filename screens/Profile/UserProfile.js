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
} from "../../firebase";
import Feed from "../Home/Feed";

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};

const UserProfile = () => {
  // States
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  // Function
  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  const getUser = () => {
    try {
      onAuthStateChanged(FIREBASE_AUTH, async (authenticatedUser) => {
        const userUID = authenticatedUser.uid;
        const docRef = doc(FIREBASE_FIRESTORE, "Users", userUID);
        const docSnap = await getDoc(docRef);
        const userData = { id: docSnap.id, ...docSnap.data() };
        setUser(userData);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      const postRef = collection(FIREBASE_FIRESTORE, "Posts");
      const querySnapshot = await getDocs(
        query(postRef, where("userID", "==", user.id))
      );
      const posts = [];
      querySnapshot.forEach((post) => {
        posts.push({ id: post.id, ...post.data() });
      });
      setPosts(posts);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  // Effects
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getPosts();
      console.log(user, posts);
    }
  }, [user]);

  // Component
  const UserHeader = () => {
    return (
      <>
        <View style={{ rowGap: 7 }}>
          <View style={styles.headerDetails}>
            <TouchableOpacity style={styles.userCount}>
              <Text style={styles.userCount}>
                {user.homie ? user.homie.length : 0}
              </Text>
              <Text style={{ color: colors.secondary }}>Homies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userCount}>
              <Text style={styles.userCount}>
                {user.clubsFollowing ? user.clubsFollowing.length : 0}
              </Text>
              <Text style={{ color: colors.secondary }}>Clubs Following</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.postTitle}>POSTS</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {posts ? (
        <>
          <View style={styles.upperContainer}>
            <Text style={styles.username}>{user.username}</Text>
            <TouchableHighlight onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={{ color: colors.secondary }}>Log Out</Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.userBio}>{user.bio}</Text>
          <FlatList
            data={posts}
            renderItem={({ item }) => <Feed feed_detail={item} />}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => <UserHeader />}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <ActivityIndicator size={50} color="blue" />
      )}
    </SafeAreaView>
  );
};

export default UserProfile;

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
    alignItems: "baseline",
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

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

import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};

const UserProfile = () => {
  // Setup
  const navigation = useNavigation();

  // States
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

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

  useFocusEffect(
    useCallback(() => {
      getUser();
      getPosts();
    }, [])
  );

  // Component
  const UserHeader = () => {
    return (
      <>
        <View style={{ rowGap: 7 }}>
          <View style={styles.headerDetails}>
            <TouchableOpacity
              style={styles.userCount}
              onPress={() => {
                navigation.navigate("Chat");
              }}
            >
              <Text style={styles.userCount}>
                {user.homies ? user.homies.length : 0}
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
      {user ? (
        <>
          <View style={styles.upperContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.userBio}>{user.bio}</Text>
            </View>
            <View style={styles.userCount}>
              <Text style={styles.userCount}>
                {user.homies ? user.homies.length : 0}
              </Text>
              <Text style={{ color: colors.secondary }}>Homies</Text>
            </View>
            <TouchableHighlight onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={{ color: colors.secondary }}>Log Out</Text>
            </TouchableHighlight>
          </View>
          {posts.length != 0 ? (
            <FlatList
              data={posts}
              renderItem={({ item }) => <Feed feed_detail={item} />}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={<Text style={styles.postTitle}>POSTS</Text>}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noPost}>
              <Text style={{ color: colors.secondary, fontSize: 30 }}>
                No Posts Yet
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Post")}>
                <Text style={styles.addPostBtn}>Add Posts</Text>
              </TouchableOpacity>
            </View>
          )}
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
  noPost: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 20,
  },
  addPostBtn: {
    fontSize: 20,
    textAlign: "center",
    padding: 7,
    color: colors.secondary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.accent,
  },
});

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import DUMMY_DATA from "../../DUMMY_DATA";
import {
  FIREBASE_FIRESTORE,
  getDoc,
  doc,
  getDocs,
  collection,
} from "../../firebase";
import { query, where } from "firebase/firestore";
import Feed from "../Home/Feed";

const colors = {
  primary: "#242038",
  secondary: "#f7ece1",
  accent: "#9067C6",
};
const Club = ({ route }) => {
  const { clubDetail } = route.params;
  const [clubData, setClubData] = useState(clubDetail);
  const [posts, setPosts] = useState();
  // Functions
  const getPosts = async () => {
    try {
      const postRef = collection(FIREBASE_FIRESTORE, "Posts");
      const querySnapshot = await getDocs(
        query(postRef, where("clubID", "==", clubData.id))
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
    getPosts();
    console.log("Posts from Club: ", posts);
  }, []);

  return (
    <View style={styles.container}>
      {clubData && (
        <>
          <Text style={styles.title}>{clubData.name}</Text>
          <FlatList
            data={posts}
            renderItem={({ item }) => <Feed feed_detail={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={styles.innerContainer}>
                <Text style={styles.description}>{clubData.description}</Text>
                <Text style={styles.postTitle}>POSTS</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

export default Club;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242038",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  innerContainer: {
    rowGap: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
    paddingBottom: 10,
  },
  title: {
    fontSize: 50,
    color: colors.accent,
    textAlign: "center",
    fontFamily: "Pacifico",
  },
  description: {
    color: colors.secondary,
    textAlign: "justify",
  },
  postTitle: {
    fontSize: 20,
    color: colors.accent,
  },
});
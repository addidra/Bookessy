import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_FIRESTORE, getDocs, collection } from "../../firebase";
import { query, where } from "firebase/firestore";
import Feed from "../Home/Feed";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import colors from "../../colors";

const Club = ({ route }) => {
  const navigation = useNavigation();
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
          <TouchableOpacity
            style={styles.groupChatBtn}
            onPress={() => {
              navigation.navigate("ClubChat", { clubData });
              Toast.show({
                type: "success",
                text1: `Joined ${clubData.name} Club`,
              });
            }}
          >
            <Text style={styles.groupChatTxt}>Join Chat</Text>
          </TouchableOpacity>
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
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  innerContainer: {
    rowGap: 20,
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  title: {
    fontSize: 50,
    color: colors.highlight,
    textAlign: "center",
    fontFamily: "Pacifico",
  },
  description: {
    textAlign: "justify",
  },
  postTitle: {
    fontSize: 20,
    color: colors.accent,
  },
  groupChatBtn: {
    backgroundColor: colors.accent,
    padding: 7,
    borderWidth: 3,
    marginBottom: 7,
    alignItems: "center",
    borderRadius: 10,
  },
  groupChatTxt: {
    fontSize: 16,
    fontWeight: "800",
  },
});

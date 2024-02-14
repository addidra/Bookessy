import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FIREBASE_FIRESTORE,
  collection,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  getAuthenticatedUserId,
  query,
  where,
  getDocs,
} from "../../firebase";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { deleteDoc } from "firebase/firestore";

const Feed = ({ feed_detail }) => {
  // States
  const userUID = getAuthenticatedUserId();
  const [postData, setPostData] = useState({
    username: undefined,
    name: undefined,
    ...feed_detail,
  });
  const [like, setLike] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);

  // Function

  const getPostRef = async () => {
    try {
      let docRef = doc(FIREBASE_FIRESTORE, "Users", feed_detail.userID);
      let docSnap = await getDoc(docRef);
      feed_detail.username = docSnap.data().username;

      docRef = doc(FIREBASE_FIRESTORE, "clubs", feed_detail.clubID);
      docSnap = await getDoc(docRef);
      feed_detail.name = docSnap.data().name;
      setPostData(feed_detail);

      // Check if the user has already liked the post
      const likeQuery = query(
        collection(FIREBASE_FIRESTORE, "Likes"),
        where("postID", "==", postData.id),
        where("likedBy", "==", userUID)
      );

      const likeDocs = await getDocs(likeQuery);
      if (likeDocs.size > 0) {
        setLike(true);
      }
    } catch (err) {
      console.log("getPostUsername err: ", err);
    }
  };

  const interactLike = async () => {
    const newLike = !like;
    const newLikes = newLike ? postData.likes + 1 : postData.likes - 1;
    setLike(newLike);
    setPostData((prevData) => ({ ...prevData, likes: newLikes }));
    if (!updateFlag) {
      setUpdateFlag(true);

      const timeout = setTimeout(async () => {
        await updatePosts(newLike, newLikes);
        setUpdateFlag(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  };

  const updatePosts = async (newLike, newLikes) => {
    try {
      const postRef = doc(FIREBASE_FIRESTORE, "Posts", postData.id);
      await updateDoc(postRef, {
        likes: newLikes,
      });
      console.log("updated succesfully");

      if (newLike) {
        // Add the like document
        await addDoc(collection(FIREBASE_FIRESTORE, "Likes"), {
          clubID: postData.clubID,
          likedBy: userUID,
          postID: postData.id,
          userID: postData.userID,
        });

        console.log("doc liked");
      } else {
        const likeQuery = query(
          collection(FIREBASE_FIRESTORE, "Likes"),
          where("postID", "==", postData.id),
          where("likedBy", "==", userUID)
        );

        const likeDocs = await getDocs(likeQuery);
        likeDocs.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        console.log("liked doc deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Effect
  useEffect(() => {
    getPostRef();
  }, []);

  return (
    <GestureHandlerRootView>
      <View
        style={{
          height: 200,
          gap: 3,
          paddingVertical: 10,
          borderBottomColor: "gray",
          borderBottomWidth: 1,
        }}
      >
        {!postData ||
        postData.username == undefined ||
        postData.name == undefined ? (
          <ActivityIndicator />
        ) : (
          <>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[styles.title, { color: "orange" }]}>
                {postData.username}
              </Text>
              <View style={styles.likeContainer}>
                <Text style={styles.likeCounter}>{postData.likes}</Text>
                <TouchableOpacity onPress={interactLike}>
                  {like ? (
                    <MaterialCommunityIcons
                      name="cards-diamond"
                      size={24}
                      color="pink"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="cards-diamond-outline"
                      size={24}
                      color="pink"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <TapGestureHandler numberOfTaps={2} onActivated={interactLike}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: "black",
                  margin: 10,
                  padding: 10,
                }}
              >
                <Text style={[styles.title, styles.rang]}>
                  {postData.content}
                </Text>
                <Text
                  style={[
                    { textAlign: "right", width: "100%", fontStyle: "italic" },
                    styles.rang,
                  ]}
                >
                  {postData.name}
                </Text>
              </View>
            </TapGestureHandler>
            <View style={styles.item}>
              <Text style={styles.rang}>{postData.caption}</Text>
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  item: {
    // backgroundColor:"yellow"
  },
  title: {
    // color: "black",
    // flex: 1,
  },
  rang: {
    color: "pink",
  },
  likeContainer: {
    flexDirection: "row",
  },
  likeCounter: {
    paddingHorizontal: 10,
    color: "white",
  },
});

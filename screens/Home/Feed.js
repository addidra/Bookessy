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
import { FIREBASE_FIRESTORE, collection, getDoc, doc } from "../../firebase";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";

const Feed = ({ feed_detail }) => {
  // States
  const [postData, setPostData] = useState({
    username: undefined,
    name: undefined,
    ...feed_detail,
  });
  const [like, setLike] = useState(false);

  // Function

  const getPost = async () => {
    try {
      let docRef = doc(FIREBASE_FIRESTORE, "Posts", feed_detail.id);
      let docSnap = await getDoc(docRef);
      console.log("getPost res: ", docSnap.data());
    } catch (error) {
      console.log("getPost error: ", error);
    }
  };

  const getPostRef = async () => {
    try {
      let docRef = doc(FIREBASE_FIRESTORE, "Users", feed_detail.userID);
      let docSnap = await getDoc(docRef);
      feed_detail.username = docSnap.data().username;

      docRef = doc(FIREBASE_FIRESTORE, "clubs", feed_detail.clubID);
      docSnap = await getDoc(docRef);
      feed_detail.name = docSnap.data().name;
      setPostData(feed_detail);
    } catch (err) {
      console.log("getPostUsername err: ", err);
    }
  };

  const interactLike = () => {
    setLike(!like);
    setPostData((prevData) => {
      const newLikes = like ? prevData.likes - 1 : prevData.likes + 1;
      return { ...prevData, likes: newLikes };
    });
  };
  // Effect
  useEffect(() => {
    getPostRef();
    console.log("passed from club.js: ", feed_detail);
  }, []);

  // useEffect(() => {
  //   console.log("useEffect feed_details: ", postData);
  // }, [postData]);

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

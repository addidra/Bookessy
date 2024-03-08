import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FIREBASE_FIRESTORE,
  FIREBASE_AUTH,
  collection,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
} from "../../firebase";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { deleteDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../colors";
import Toast from "react-native-toast-message";

const Feed = ({ feed_detail, user = false, reload }) => {
  // States
  const userUID = FIREBASE_AUTH.currentUser.uid;
  const [postData, setPostData] = useState({
    username: undefined,
    name: undefined,
    ...feed_detail,
  });
  const [like, setLike] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(FIREBASE_FIRESTORE, "Posts", feed_detail.id));
      reload();
      Toast.show({
        type: "success",
        text1: "Posts is Deleted",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Effect
  useEffect(() => {
    getPostRef();
    console.log(feed_detail);
  }, []);

  const DeleteConfirmationDialog = ({ visible, onCancel, onConfirm }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this post?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: colors.accent }}
                onPress={onCancel}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: "#f44336" }}
                onPress={onConfirm}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
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
          <ActivityIndicator color={colors.highlight} />
        ) : (
          <>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={[
                  styles.title,
                  { color: colors.accent, fontWeight: "900" },
                ]}
              >
                {postData.username}
              </Text>
              <View style={styles.likeContainer}>
                <Text style={styles.likeCounter}>{postData.likes}</Text>
                <TouchableOpacity onPress={interactLike}>
                  {like ? (
                    <MaterialCommunityIcons
                      name="cards-diamond"
                      size={24}
                      color={colors.accent}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="cards-diamond-outline"
                      size={24}
                      color={colors.accent}
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
                  backgroundColor: colors.secondary,
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
            <View style={user && styles.item}>
              <Text style={styles.rang}>{postData.caption}</Text>
              {user && (
                <TouchableOpacity
                  onPress={() => {
                    setDeleteToggle(true);
                  }}
                >
                  <AntDesign name="delete" size={18} color="red" />
                </TouchableOpacity>
              )}
              <DeleteConfirmationDialog
                visible={deleteToggle}
                onCancel={() => {
                  setDeleteToggle(false);
                }}
                onConfirm={handleDelete}
              />
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    // color: "black",
    // flex: 1,
  },
  likeContainer: {
    flexDirection: "row",
  },
  likeCounter: {
    paddingHorizontal: 10,
    color: colors.highlight,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  modalView: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import DUMMY_DATA from "../../DUMMY_DATA.js";
import Feed from "./Feed";
import ChatBotMain from "../ChatBot/ChatBotMain";
import { FIREBASE_FIRESTORE, getDocs, collection } from "../../firebase.js";
const Home = () => {
  const [loaded] = useFonts({
    Pacifico: require("../../assets/fonts/Pacifico-Regular.ttf"),
  });
  const navigation = useNavigation();

  // States
  const [posts, setPosts] = useState(null);

  // Functions
  const getPostList = async () => {
    try {
      const postRef = await getDocs(collection(FIREBASE_FIRESTORE, "Posts"));
      const posts = [];
      postRef.forEach((post) => {
        posts.push({ id: post.id, ...post.data() });
      });
      setPosts(posts);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  // Effects
  useEffect(() => {
    getPostList();
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity
        style={{
          borderWidth: 2,
          borderRadius: 100,
          width: 70,
          position: "absolute",
          bottom: 1,
          right: 1,
          backgroundColor: "pink",
          paddingVertical: 10,
          zIndex: 10,
        }}
        onPress={() => {
          navigation.navigate("ChatBot");
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>ChatBot</Text>
      </TouchableOpacity> */}
      <View style={styles.topBar}>
        <Text style={[styles.title]}>Bookessy</Text>
        <TouchableOpacity
          style={styles.chat}
          onPress={() => {
            navigation.navigate("ChatBot");
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>ChatBot</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={posts}
          renderItem={({ item }) => <Feed feed_detail={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#242038",
  },
  topBar: {
    flexDirection: "row", // Ensure that child elements can be positioned relative to this container
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    color: "#e4d5b7",
    fontSize: 20,
    fontFamily: "Pacifico",
  },
  chat: {
    marginTop: 10,
  },
  content: {
    color: "#e4d5b7",
    flex: 1,
  },
  item: {
    backgroundColor: "yellow",
    flex: 1,
  },
});

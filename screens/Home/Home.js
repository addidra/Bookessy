import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import Feed from "./Feed";
import { FIREBASE_FIRESTORE, getDocs, collection } from "../../firebase.js";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../colors.js";
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

  useFocusEffect(
    React.useCallback(() => {
      getPostList();
    }, [])
  );

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={[styles.title]}>Bookessy</Text>
        <TouchableOpacity
          style={styles.chat}
          onPress={() => {
            navigation.navigate("ChatBot");
          }}
        >
          <MaterialCommunityIcons
            name="robot-excited"
            size={28}
            color={colors.highlight}
            style={{ alignSelf: "center" }}
          />
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
    backgroundColor: colors.primary,
  },
  topBar: {
    flexDirection: "row", // Ensure that child elements can be positioned relative to this container
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    color: colors.highlight,
    fontSize: 28,
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

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import {
  FIREBASE_FIRESTORE,
  getDocs,
  collection,
  FIREBASE_AUTH,
  addDoc,
} from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import colors from "../../colors";

const AddPost = () => {
  // State variables to store user inputs
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedClub, setSelectedClub] = useState("Select Club");
  const [isClicked, setIsClicked] = useState(false);
  const searchRef = useRef();

  const [clubList, setClubList] = useState();
  const [user, setUser] = useState();
  const [filteredClubList, setFilteredClubList] = useState([]);

  const navigation = useNavigation();
  // Functions

  const onSearch = (txt) => {
    if (txt === "") {
      setFilteredClubList(clubList);
    } else {
      let tempData = clubList.filter((item) =>
        item.name.toLowerCase().includes(txt.toLowerCase())
      );
      setFilteredClubList(tempData);
    }
  };

  const handleSubmit = async () => {
    if (caption == "" || content == "" || selectedClub == "Select Club") {
      Toast.show({
        type: "error",
        text1: "Enter all field",
      });
      return;
    }

    const newPost = {
      caption: caption,
      content: content,
      clubID: selectedClub.id,
      likes: 0,
      userID: user.uid,
    };
    // Further logic to submit data to backend/database
    try {
      await addDoc(collection(FIREBASE_FIRESTORE, "Posts"), {
        ...newPost,
      });
      navigation.navigate("Home");
      setCaption("");
      setContent("");
      setSelectedClub("Select Club");
      Toast.show({
        type: "success",
        text1: "Think Posted",
      });
    } catch (error) {
      console.log("Handle submit error: ", error);
    }
  };

  const getClubList = async () => {
    try {
      const clubSnap = await getDocs(collection(FIREBASE_FIRESTORE, "clubs"));
      const clubList = [];
      clubSnap.forEach((doc) => {
        clubList.push({ id: doc.id, ...doc.data() });
      });
      setClubList(clubList);
      setFilteredClubList(clubList);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = () => {
    try {
      onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const test = () => {
    console.log(selectedClub);
  };

  // Effects
  useEffect(() => {
    getClubList();
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Button onPress={test} title="Click Me"></Button> */}
      <Text
        style={{ color: colors.highlight, fontSize: 30, paddingBottom: 30 }}
      >
        Add New Post
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={7}
        style={styles.input}
        placeholder="Enter Quote from Book"
        placeholderTextColor="gray"
        value={content}
        onChangeText={(text) => setContent(text)}
      />
      <TextInput
        style={[styles.input, { height: 50 }]}
        placeholder="Additional Comment"
        placeholderTextColor="gray"
        value={caption}
        onChangeText={(text) => setCaption(text)}
      />
      <TouchableOpacity
        style={styles.dropdownSelector}
        onPress={() => {
          setIsClicked(!isClicked);
        }}
      >
        <Text style={styles.defaultValue}>
          {selectedClub.name ? <>{selectedClub.name}</> : <>Select Club</>}
        </Text>
        {isClicked ? (
          <Feather name="arrow-up" size={24} color="gray" />
        ) : (
          <Feather name="arrow-down" size={24} color="gray" />
        )}
      </TouchableOpacity>
      {isClicked && (
        <View style={styles.dropdownArea}>
          <TextInput
            ref={searchRef}
            placeholder="Search"
            placeholderTextColor="gray"
            style={styles.searchInput}
            onChangeText={(txt) => onSearch(txt)}
          />
          <FlatList
            data={filteredClubList}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.clubItem}
                  onPress={() => {
                    setSelectedClub(item);
                    onSearch("");
                    setIsClicked(false);
                    searchRef.current.clear();
                  }}
                >
                  <Text style={styles.defaultValue}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={{ fontSize: 20 }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 120,
  },
  input: {
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdownSelector: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    alignSelf: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  defaultValue: { color: "gray" },
  dropdownArea: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  searchInput: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "gray",
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  clubItem: {
    width: "85%",
    height: 50,
    borderBottomWidth: 0.2,
    borderBottomColor: "gray",
    alignSelf: "center",
    justifyContent: "center",
  },
  submitBtn: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: colors.accent,
  },
});

export default AddPost;

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/Login/LoginScreen";
import RegistrationScreen from "./screens/Login/RegistrationScreen";
import Home from "./screens/Home/Home";
import SearchScreen from "./screens/Search/SearchScreen";
import Club from "./screens/Search/Club";
import AddPost from "./screens/AddPost/AddPost";
import UserProfile from "./screens/Profile/UserProfile";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Chat from "./screens/Home/Chat";
import ChatBotMain from "./screens/ChatBot/ChatBotMain";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebase";
import MoreDetail from "./screens/Login/MoreDetail";

// Tabs
const Tab = createBottomTabNavigator();

// Stack
const Stack = createNativeStackNavigator();

const HomeChatStack = () => {
  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerShown: false,
    // }}
    >
      <Stack.Screen
        name="Main"
        component={Home}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen name="Chat" component={Chat} /> */}
      <Stack.Screen name="ChatBot" component={ChatBotMain} />
    </Stack.Navigator>
  );
};

const SearchScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SearchScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Club" component={Club} />
    </Stack.Navigator>
  );
};

const TabMain = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRouteName"
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          let colors = "black";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          }

          return <Ionicons name={iconName} size={size} color={colors} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeChatStack} />
      <Tab.Screen name="Search" component={SearchScreenStack} />
      <Tab.Screen name="Post" component={AddPost} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

const LoginStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Main" component={TabMain} />
      <Stack.Screen name="FavClub" component={MoreDetail} />
    </Stack.Navigator>
  );
};

export default function Navigation() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      onAuthStateChanged(FIREBASE_AUTH, (user) => {
        console.log("user", user);
        setUser(user);
      });
    } catch (error) {
      console.log("Auth State change error: ", error);
    }
  }, []);
  return (
    <NavigationContainer>
      {/* <TabMain /> */}
      {/* <LoginScreen /> */}
      {user ? <TabMain /> : <LoginStack />}
    </NavigationContainer>
  );
}

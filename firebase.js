import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3TSu5o9Bcd_8PFdU_CJMLeHNT_k-Iifk",
  authDomain: "bookessy-4c7ce.firebaseapp.com",
  projectId: "bookessy-4c7ce",
  storageBucket: "bookessy-4c7ce.appspot.com",
  messagingSenderId: "860474654514",
  appId: "1:860474654514:web:7894be875a1359658ea12b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const FIREBASE_FIRESTORE = getFirestore(app);

// const db = firebase.firestore();

export {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
};

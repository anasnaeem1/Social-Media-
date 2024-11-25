// firebase.js

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "social-e876e.firebaseapp.com",
  projectId: "social-e876e",
  storageBucket: "social-e876e.appspot.com",
  messagingSenderId: "347622724461",
  appId: "1:347622724461:web:1f58bd8952ea750950c064",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase storage instance
const storage = getStorage(app);

export { storage };

// const admin = require("firebase-admin");
// const uuid = require("uuid-v4");
// const express = require("express");
// const multer = require("multer");
// const port = process.env.PORT || 3000;
// const serviceAccount = require("../social-c0dcc-firebase-adminsdk-bwqny-91531fe40c.json");
// const { initializeApp } = require("firebase/app");
// const { getAnalytics } = require("firebase/analytics");
// const { errorHandler } = require("./helpers");
// const { getFirestore, doc, setDoc } = require("firebase/firestore");
// // const app = express()

// const {
//   apiKey,
//   authDomain,
//   projectId,
//   storageBucket,
//   messagingSenderId,
//   appId,
//   measurementId,
// } = process.env;

// const firebaseConfig = {
//   apiKey: apiKey,
//   authDomain: authDomain,
//   projectId: projectId,
//   storageBucket: storageBucket,
//   messagingSenderId: messagingSenderId,
//   appId: appId,
//   measurementId: measurementId,
// };

// let app;
// let firestoreDb;

// const initializeFirebaseApp = () => {
//   try {
//     app = initializeApp(firebaseConfig);
//     firestoreDb = getFirestore();
//     return app;
//   } catch (error) {
//     errorHandler(error, "firebase-initializeFirebaseApp");
//   }
// };

// const uploadProcessedData = async () => {
//   const dataToUpload = {
//     key1: "test",
//     key2: 123,
//     key3: new Date(),
//   };
//   try {
//     const document = doc(firestoreDb, "social", "8NkdiWBsTwWsrFVtajLf");
//     let dataUpdated = await setDoc(document, dataToUpload);
//     return dataUpdated;
//   } catch (error) {
//     errorHandler(error, "firebase-uploadProcessedData");
//   }
// };

// const getFirebaseApp = () => app

// // // lInitiaize Firebase
// // const analytics = getAnalytics(app);

// module.exports = {
//   initializeFirebaseApp,
//   getFirebaseApp,
//   uploadProcessedData,
// };

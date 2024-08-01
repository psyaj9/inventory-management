// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK4ACsHj2vE1FQ4WnNKXTLEvyj1zcwGRY",
  authDomain: "inventory-management-27bf4.firebaseapp.com",
  projectId: "inventory-management-27bf4",
  storageBucket: "inventory-management-27bf4.appspot.com",
  messagingSenderId: "592633654020",
  appId: "1:592633654020:web:0766b1032a0d73fd48be51",
  measurementId: "G-DTZ35RM9WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
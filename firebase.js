import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK4ACsHj2vE1FQ4WnNKXTLEvyj1zcwGRY",
  authDomain: "inventory-management-27bf4.firebaseapp.com",
  projectId: "inventory-management-27bf4",
  storageBucket: "inventory-management-27bf4.appspot.com",
  messagingSenderId: "592633654020",
  appId: "1:592633654020:web:0766b1032a0d73fd48be51",
  measurementId: "G-DTZ35RM9WH"
};

let app;
let firestore;
let storage;
let auth;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  if ('measurementId' in firebaseConfig) {
    getAnalytics(app);
  }
  firestore = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
}

export { firestore, storage, auth };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDRBAQdvJXksQUCxQs9RtqYwiMxh6I6598",
    authDomain: "ecommerce-typescript-55833.firebaseapp.com",
    projectId: "ecommerce-typescript-55833",
    storageBucket: "ecommerce-typescript-55833.appspot.com",
    messagingSenderId: "463130135306",
    appId: "1:463130135306:web:0f7e3de842331a290708f3",
    measurementId: "G-WY3K6B1DK2"
  };

export const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);

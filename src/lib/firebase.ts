// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2Qcl0svgAj7ZIQaPkIQKDzjXWIVrpbjA",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "spelling-auth",
  appId: "spelling-auth",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

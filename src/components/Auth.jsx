import { auth, googleProvider, db } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import React, { useState } from "react";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Set paramaters so Google Authentication asks which account to use every time
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function signUp() {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      createDocument(credential.user.uid);
    } catch (err) {
      console.error(err);
    }
  }

  async function signInWithGoogle() {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      createDocument(credential.user.uid);
    } catch (err) {
      console.error(err);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      document.getElementById("email-input").value = "";
      document.getElementById("password-input").value = "";
    } catch {
      console.error(err);
    }
  }

  async function signIn() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  }

  // Function to create document in "users" collection with user ID as document name
  async function createDocument(uid) {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {email: auth.currentUser.email, uid: uid, exerciseList: arrayUnion()}, { merge: true });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <input
        placeholder="Email"
        id="email-input"
        onChange={handleEmailChange}
      />
      <input
        placeholder="Password"
        id="password-input"
        onChange={handlePasswordChange}
        type="password"
      />
      <button onClick={signIn}>Sign in</button>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={logout}>Log out</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}

export default Auth;

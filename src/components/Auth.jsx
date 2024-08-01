import { auth} from "../FirebaseConfig";
import {
  onAuthStateChanged
} from "firebase/auth";
import React, { useState, useEffect } from "react";
import Logout from "./Logout";
import SignUpSignIn from "./SignUpSignIn";

function Auth() {
  const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

 
  return (
    <div className="sign-in">
      {user && <Logout />}
      {!user && <SignUpSignIn/>}
    </div>
  );
}

export default Auth;

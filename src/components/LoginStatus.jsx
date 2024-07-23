// Component to check log-in status

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { useState, useEffect } from "react";

function LoginStatus() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const login = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                console.log("Current user:", currentUser.email);
                console.log("Current user ID:", currentUser.uid);
            } else {
                console.log("User is signed out");
            }
        });

        // Cleanup login on unmount
        return () => login();
    }, [auth]);

    if (!user) {
        return <div>Please sign in</div>;
    }

    return (
        <>
            <img className="user-avatar" src={user.photoURL} />
            <p>Welcome {user.displayName}!</p>
        </>
    );
}

export default LoginStatus;

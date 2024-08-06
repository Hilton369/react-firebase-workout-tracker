import Auth from "./components/Auth";
import LoginStatus from "./components/LoginStatus";
import CreateExercise from "./components/CreateExercise";
import { auth } from "./FirebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import ExerciseDropdown from "./components/ExerciseDropdown";
import Logo from "./components/Logo";
import Credits from "./components/Credits";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <>
            <Auth />
            <LoginStatus />
            {!user && <Logo/>}
            {!user && <Credits/>}
            {user && <CreateExercise />}
            <br />
            {user && <ExerciseDropdown />}
        </>
    );
}

export default App;

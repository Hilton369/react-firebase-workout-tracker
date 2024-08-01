import { auth, googleProvider, db } from "../FirebaseConfig";
import { signOut } from "firebase/auth";

function Logout() {
    async function logout() {
        try {
            await signOut(auth);
        } catch {
            console.error(err);
            alert(err);
        }
    }

    return (
        <>
            <button onClick={logout}>Log out</button>
        </>
    );
}

export default Logout;

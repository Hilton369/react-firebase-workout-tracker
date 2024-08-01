import { auth, db } from "../FirebaseConfig";
import {
    doc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    arrayRemove,
    arrayUnion,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getExerciseDocId } from "./Helpers";
import ExerciseDisplay from "./ExerciseDisplay";

// This component handles the dropdown menu for the user's selected exercise
function ExerciseDropdown() {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState("");
    const [isSelected, setIsSelected] = useState(false);

    useEffect(()=>{
        selectedExercise === "" ? setIsSelected(false) : setIsSelected(true);
    }, [selectedExercise]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "users", auth.currentUser.uid),
            (document) => {
                if (document.exists()) {
                    setExercises(document.data().exerciseList || []);
                }
            }
        );

        // Cleanup function
        return () => unsubscribe();
    }, []);
    

    function handleSelectedExerciseChange(e) {
        setSelectedExercise(e.target.value);
        console.log("Selected Exercise: " + e.target.value);
    }

    // Function to delete selected exercise
    async function deleteExercise() {
        if (selectedExercise != "") {
            const userRef = doc(db, "users", auth.currentUser.uid);

            try {
                await updateDoc(userRef, {
                    exerciseList: arrayRemove(selectedExercise),
                });
                console.log("Deleted exercise: " + selectedExercise);
                const docID = await getExerciseDocId(db, auth.currentUser.uid, selectedExercise);
                await deleteDoc(doc(db, "exercises", docID));
                setSelectedExercise("");
            } catch (err) {
                console.error(err);
            }
        }
    }

    // Function to update name of the selected exercise
    async function editExerciseName() {
        let newName = prompt("Please enter new exercise name:").trim();
        if (newName == "" || newName == null) {
            console.log("User cancelled the name change");
        } else {
            const userRef = doc(db, "users", auth.currentUser.uid);
            try {
                let docID = await getExerciseDocId(db, auth.currentUser.uid, selectedExercise);
                let exerciseRef = doc(db, "exercises", docID);
                await updateDoc(exerciseRef, { exerciseName: newName });
                await updateDoc(userRef, { exerciseList: arrayUnion(newName) });
                await updateDoc(userRef, {
                    exerciseList: arrayRemove(selectedExercise),
                });
                console.log("Exercise name changed to: " + newName);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <>
            <h3>Your Exercises</h3>
            <select
                id="exercise-select"
                value={selectedExercise}
                onChange={handleSelectedExerciseChange}
                className="exercise-select"
            >
                <option value="">Select an exercise...</option>
                {exercises.map((exercise, index) => (
                    <option key={index} value={exercise}>
                        {exercise}
                    </option>
                ))}
            </select>
            <button onClick={deleteExercise}>Delete</button>
            <div className="divider"/>
            <button onClick={editExerciseName} className="edit-exercise-name">Change Exercise Name</button>
			<br/>
			{isSelected && <ExerciseDisplay selectedExercise={selectedExercise}/>}
        </>
    );
}

export default ExerciseDropdown;

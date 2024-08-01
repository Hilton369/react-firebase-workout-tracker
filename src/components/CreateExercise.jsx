import { db, auth } from "../FirebaseConfig";
import React, { useState } from "react";
import {
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    collection,
    query,
    getDocs,
    where,
} from "firebase/firestore";

function CreateExercise() {
    const [exerciseName, setExerciseName] = useState("");

    function handleExerciseChange(e) {
        setExerciseName(e.target.value);
    }

    async function createExerciseDocument() {
        if (exerciseName != "") {
            let name = exerciseName.trim();
            const usersRef = doc(db, "users", auth.currentUser.uid);
            const exercisesRef = collection(db, "exercises");
            const q = query(
                exercisesRef,
                where("exerciseName", "==", name),
                where("ownerUid", "==", auth.currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            // Check for duplicate exercise entries
            if (querySnapshot.size == 0) {
                try {
                    await setDoc(doc(exercisesRef), {
                        ownerUid: auth.currentUser.uid,
                        exerciseName: name,
                    })
                    await updateDoc(usersRef, {
                        exerciseList: arrayUnion(name),
                    });
                    document.getElementById("create-exercise").value = "";
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    return (
        <>
            <h3>Create Exercise</h3>
            <input
                placeholder="Exercise Name..."
                id="create-exercise"
                onChange={handleExerciseChange}
                className="create-exercise-input"
            />
            <button onClick={createExerciseDocument} className="create-exercise-button">Create!</button>
        </>
    );
}

export default CreateExercise;

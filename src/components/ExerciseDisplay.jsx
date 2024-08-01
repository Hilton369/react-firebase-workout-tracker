import { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    onSnapshot,
    setDoc,
    doc,
    query,
    orderBy,
    deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../FirebaseConfig";
import { getExerciseDocId } from "./Helpers";

function ExerciseDisplay(props) {
    // Workout object for converter to convert Firebase document fields into usable variables
    class Workout {
        constructor(date, sets, reps, weight, id) {
            this.id = id;
            this.arr = [date, sets, reps, weight];
        }

        toString() {
            return (
                "ID: " +
                this.id +
                ", " +
                "Date: " +
                this.arr[0] +
                ", " +
                "Sets: " +
                this.arr[1] +
                ", " +
                "Reps: " +
                this.arr[2] +
                ", " +
                "Weight: " +
                this.arr[3]
            );
        }
    }

    // Converter for Firebase documents
    const workoutConverter = {
        toFirestore: (workout) => {
            return {
                id: workout.id,
                date: workout.date,
                sets: workout.sets,
                reps: workout.reps,
                weight: workout.weight,
            };
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            return new Workout(
                data.date,
                data.sets,
                data.reps,
                data.weight,
                data.id
            );
        },
    };

    const selectedExercise = props.selectedExercise;

    const [workoutList, setWorkoutList] = useState([]);
    const [date, setDate] = useState("");
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState(0);

    const heading = ["", "Date", "Sets", "Reps", "Weight"];

    // Function to populate an array with all entries of an exercise
    async function getWorkouts() {
        try {
            let array = [];
            const docID = await getExerciseDocId(
                db,
                auth.currentUser.uid,
                selectedExercise
            );
            const allWorkouts = await getDocs(
                query(
                    collection(db, "exercises", docID, "entries").withConverter(
                        workoutConverter
                    ),
                    orderBy("date", "desc")
                )
            );
            allWorkouts.forEach((document) => {
                array.push(document.data());
            });
            setWorkoutList(array);
        } catch (err) {
            console.error(err);
        }
    }

    // Set up snapshot listener for changes to each user's exercises collection
    useEffect(() => {
        let unsubscribe = () => {};

        async function setupListener() {
            if (selectedExercise !== "" && selectedExercise !== null) {
                const docID = await getExerciseDocId(
                    db,
                    auth.currentUser.uid,
                    selectedExercise
                );
                unsubscribe = onSnapshot(
                    collection(db, "exercises", docID, "entries"),
                    () => {
                        getWorkouts();
                    }
                );
            }
        }

        setupListener();

        return () => unsubscribe();
    }, [selectedExercise]);

    function handleDateChange(e) {
        setDate(e.target.value);
    }

    function handleSetChange(e) {
        setSets(e.target.value);
    }

    function handleRepChange(e) {
        setReps(e.target.value);
    }

    function handleWeightChange(e) {
        setWeight(e.target.value);
    }

    async function deleteEntry(index) {
        try {
            const docID = await getExerciseDocId(
                db,
                auth.currentUser.uid,
                selectedExercise
            );
            const entryID = workoutList[index].id;
            await deleteDoc(doc(db, "exercises", docID, "entries", entryID));
        } catch (err) {
            console.error(err);
        }
    }

    // Function to add new document to exercise entry collection
    async function addExercise() {
        if (selectedExercise !== "" && selectedExercise !== null) {
            const docID = await getExerciseDocId(
                db,
                auth.currentUser.uid,
                selectedExercise
            );
            const collectionRef = collection(db, "exercises", docID, "entries");
            const docRef = doc(collectionRef);
            await setDoc(docRef, {
                date: date,
                sets: sets,
                reps: reps,
                weight: weight,
            });
            const newDocID = docRef.id;
            await setDoc(
                docRef,
                {
                    id: newDocID,
                },
                { merge: true }
            );
        } else {
            alert("Please select an exercise");
        }
    }

    return (
        <>
            <p>Add a new workout</p>
            <div className="exercise-display-inputs">
                <input type="date" onChange={handleDateChange} />
                <input
                    type="number"
                    placeholder="No. of sets"
                    onChange={handleSetChange}
                />
                <input
                    type="number"
                    placeholder="No. of reps"
                    onChange={handleRepChange}
                />
                <input
                    type="number"
                    placeholder="weight"
                    onChange={handleWeightChange}
                />
            </div>
            <button onClick={addExercise} className="add-workout-button">Add Workout</button>
            {selectedExercise !== "" && (
                <table className="workout-table">
                    <thead>
                        <tr>
                            {heading.map((head, headID) => (
                                <th key={headID}>{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {workoutList.map((obj, index) => (
                            <tr key={index}>
                                <td className="edit-delete-column">
                                    <button
                                        onClick={() => deleteEntry(index)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                                {obj.arr.map((values, valueIndex) => (
                                    <td
                                        key={valueIndex}
                                        className="date-sets-reps-weight"
                                    >
                                        {values}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default ExerciseDisplay;

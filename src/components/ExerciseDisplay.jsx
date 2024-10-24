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
import Chart from "./Chart";

function ExerciseDisplay(props) {
  // Workout object for converter to convert Firebase document fields into usable variables
  class Workout {
    constructor(date, sets, reps, weight, id) {
      this.id = id;
      this.date = date;
      this.sets = sets;
      this.reps = reps;
      this.weight = weight;
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
      return new Workout(data.date, data.sets, data.reps, data.weight, data.id);
    },
  };

  const selectedExercise = props.selectedExercise;

  const [workoutList, setWorkoutList] = useState([]);
  const [date, setDate] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [chartBool, setChartBool] = useState(false);
  const [chartX, setChartX] = useState([]);
  const [chartY, setChartY] = useState([]);

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

  // useEffect function for updating the current list of workout entries for the selected exercise
  useEffect(() => {
    if (!(selectedExercise == "" || selectedExercise == null)) {
      getWorkouts();
    }
  }, [selectedExercise]);

  //useEffect function to populate X and Y axis of training volume chart
  useEffect(() => {
    const arrX = [],
      arrY = [];
    for (let i = 0; i < workoutList.length; i++) {
      arrX.push(workoutList[i].arr[0]);
      arrY.push(
        workoutList[i].arr[1] * workoutList[i].arr[2] * workoutList[i].arr[3]
      );
    }
    setChartX(arrX.reverse());
    setChartY(arrY.reverse());
  }, [workoutList, chartBool]);

  //Event handlers
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

  // Function to delete corresponding workout entry from database
  async function deleteEntry(index) {
    try {
      const docID = await getExerciseDocId(
        db,
        auth.currentUser.uid,
        selectedExercise
      );
      const entryID = workoutList[index].id;
      await deleteDoc(doc(db, "exercises", docID, "entries", entryID));
      workoutList.splice(index, 1);
      setWorkoutList([...workoutList]);
    } catch (err) {
      console.error(err);
    }
  }

  // Function to add new document to exercise entry collection
  async function addExercise() {
    if (selectedExercise !== "" || selectedExercise !== null) {
      if (
        document.getElementById("date-input").value == null ||
        document.getElementById("date-input").value == ""
      ) {
        alert("Please select a date");
      } else {
        try {
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
          const newWorkoutList = [
            ...workoutList,
            new Workout(date, sets, reps, weight, newDocID),
          ];
          newWorkoutList.sort(
            (a, b) => Date.parse(b.date) - Date.parse(a.date)
          );
          setWorkoutList(newWorkoutList);
          document.getElementById("date-input").value = null;
          document.getElementById("sets-input").value = null;
          document.getElementById("sets-input").placeholder = "No. of sets";
          document.getElementById("reps-input").value = null;
          document.getElementById("reps-input").placeholder = "No. of reps";
          document.getElementById("weight-input").value = null;
          document.getElementById("weight-input").placeholder = "Weight";
        } catch (err) {
          console.error(err);
          alert(err);
        }
      }
    } else {
      alert("Please select an exercise");
    }
  }

  // Function to show chart visual popup
  function showChart() {
    setChartBool(true);
  }

  return (
    <>
      {/* Inputs and buttons for adding new workout entry */}
      <h4>Add a new workout entry:</h4>
      <div className="exercise-display-inputs">
        <input type="date" onChange={handleDateChange} id="date-input" />
        <input
          type="number"
          placeholder="No. of sets"
          onChange={handleSetChange}
          id="sets-input"
        />
        <input
          type="number"
          placeholder="No. of reps"
          onChange={handleRepChange}
          id="reps-input"
        />
        <input
          type="number"
          placeholder="Weight"
          onChange={handleWeightChange}
          id="weight-input"
        />
      </div>
      <button onClick={addExercise} className="add-workout-button">
        Add Workout
      </button>

      {/* Chart Popup */}
      <button onClick={showChart} className="chart-button">
        Create Training Volume Chart
      </button>
      {chartBool && (
        <Chart
          selectedExercise={selectedExercise}
          chartBool={chartBool}
          setChartBool={setChartBool}
          chartX={chartX}
          setChartX={setChartX}
          chartY={chartY}
          setChartY={setChartY}
        />
      )}
      {/* Workout Entries Table */}
      <div className="table-wrapper">
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
                    <td key={valueIndex} className="date-sets-reps-weight">
                      {values}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default ExerciseDisplay;

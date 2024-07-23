import { collection, query, getDocs, where } from "firebase/firestore";

export async function getExerciseDocId(db, uid, exerciseName) {
    if(exerciseName !== "" || exerciseName !== null){
        let docID;
        const collectionRef = collection(db, "exercises");
        const q = query(
            collectionRef,
            where("ownerUid", "==", uid),
            where("exerciseName", "==", exerciseName)
        );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                docID = doc.id;
            });
            return docID;
        } catch (err) {
            console.error(err);
        }
    }
}

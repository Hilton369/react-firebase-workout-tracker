Fitness Journal Webapp

A web application for tracking workouts and exercises, built with React and Firebase.

Features

    User authentication via Firebase
    Add, view, edit, and delete exercises
    Create, read, update, and delete workout entries
    Responsive design for desktop and mobile use

Technologies Used

    React
    Firebase (Authentication and Firestore Database)
    CSS

Setup

    1. Clone the repository:
        git clone https://github.com/Hilton369/react-firebase-workout-tracker.git
        cd react-firebase-workout-tracker

    2. Install dependencies
        npm install vite@latest
        npm install firebase
        npm install react-chartjs-2 chart.js

    3. Create and setup a Firebase project on the Firebase website.

    4. Obtain API key for your Firebase project. Create a new file in the ./src folder called 
       FirebaseConfig.jsx and copy the following into it (with your own API key, project id, 
       etc... from your Firebase project setup):

        // Import the functions you need from the SDKs you need
        import { initializeApp } from "firebase/app";
        import { getAnalytics } from "firebase/analytics";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {

        //YOUR FIREBASE CONFIG GOES HERE
        
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);

Usage

Webapp can be used at:
https://workout-tracker-app-e3622.web.app/

    1. Register or log in to your account (Google accounts supported).
    2. Add exercises to your personal exercise library.
    3. Create workout entries by selecting exercises and adding details like sets, reps, and weight.
    4. View, edit, or delete your workout entries and exercises as needed.

License
This project is licensed under the MIT License.

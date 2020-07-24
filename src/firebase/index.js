import app, { firestore } from 'firebase/app';

// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/storage';
// import 'firebase/functions';
import { database } from 'firebase';


const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

app.initializeApp( config );

// export default app;
// export const auth = app.auth();
export const db = app.firestore();
// export const functions = app.functions();
// export const storage = app.storage();

// // *** Auth API ***
//
// export const listenAuthState = ( observer ) => {
//   return auth.onAuthStateChanged( observer );
// };
//
// export const doSignInWithEmailAndPassword = ( email, password ) => {
//   return auth.signInWithEmailAndPassword( email, password );
// };

// export const doLogout = () => auth.signOut();

// export const serverTimestamp = () => firestore.FieldValue.serverTimestamp();

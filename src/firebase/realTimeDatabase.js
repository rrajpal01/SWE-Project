import { getDatabase, ref, set } from "./firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const db = getDatabase();



export function writeUserData(uid, firstName, lastName, email) {
 return set(ref(db, `users/${uid}`), {
   name:  `${firstName} ${lastName}`,
   email
 });
}
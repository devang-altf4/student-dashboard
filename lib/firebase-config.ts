import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {

  apiKey: "AIzaSyCnBi0WNeoWDLqhUumIvRN1T7ldmVnoknM",
  authDomain: "devang-9a1c3.firebaseapp.com",
  projectId: "devang-9a1c3",
  storageBucket: "devang-9a1c3.firebasestorage.app",
  messagingSenderId: "403906640911",
  appId: "1:403906640911:web:735507cd526c12a2ed777a",
  measurementId: "G-Z6HXVXG2KG"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

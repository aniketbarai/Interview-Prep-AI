import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;
    console.log("Google User:", user);

    return user;
  } catch (error) {
    console.error("Google login failed:", error.message);
  }
};
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    // 🔥 IMPORTANT: send to backend
    const token = await user.getIdToken();

    await axios.post("https://interview-prep-ai-rho.vercel.app//api/auth/google", {
      token,
    });

    console.log("User sent to backend");
  } catch (error) {
    console.error("Google login error:", error);
  }
};
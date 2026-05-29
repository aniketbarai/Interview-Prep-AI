import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
      token,
    });

    const userData = response.data;
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }

    return userData;
  } catch (error) {
    console.error("Google login error:", error?.response?.data || error.message || error);
    throw error;
  }
};

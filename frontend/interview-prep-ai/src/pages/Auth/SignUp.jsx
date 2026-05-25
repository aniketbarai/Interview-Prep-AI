import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Input from "../../components/Input/Input"
import ProfilePhoto from '../../components/Input/ProfilePhoto';
import { validateEmail } from '../../utils/helper';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({setCurrentPage}) => {

    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if(!fullName){
       setError("Please enter full name")
       return
    }
    if(!validateEmail(email)){
       setError("Please enter a valid email address.")
      return
      }
    if(!password) {
    setError("Plesase enter the password.")
    return;
  }
  setError("")

  // signUpApi call
  try {
      let profileImageUrl = "";
      // Upload profile image if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: fullName,
          email,
          password,
          profileImageUrl,
        }
      );

      const { token } = response.data;

      if (token) {
        // updateUser already stores token + user
        updateUser(response.data);
        navigate("/dashboard");
      }
  } catch (error) {
      setError(error.response.data.message)
  }
  };

  useEffect(() => {
  // Disable scroll when the component mounts
  document.body.style.overflow = 'hidden';

  // Re-enable scroll when the component unmounts (cleanup function)
  return () => {
    document.body.style.overflow = 'unset';
  };
}, []);

  return (
    /* Increased max-width to 600px for a more "card-like" feel on desktop */
    <div className="w-[95vw] max-w-[600px] md:w-auto p-8 flex flex-col justify-start bg-white rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-black">Create an Account</h3>
      <p className='text-sm text-slate-700 mb-6'>Join us today by entering your details below.</p>

      <form onSubmit={handleSignUp}>
        <div className="flex flex-col items-center mb-6">
          <ProfilePhoto image={profilePic} setImage={setProfilePic} />
        </div>

        {/* Changed grid-cols-1 to md:grid-cols-2 to utilize the horizontal space on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <Input 
            value={fullName}
            onChange={({target})=> setFullName(target.value)}
            label="Full Name"
            placeholder="John"
            type="text"
          />
          <Input 
            value={email}
            onChange={({target})=> setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          
          {/* Spanning password and error/button across both columns for visual weight */}
          <div className="md:col-span-2">
            <Input 
              value={password}
              onChange={({target})=> setPassword(target.value)}
              label = "Password"
              placeholder="Min 8 Characters"
              type="password" 
            />
          </div>

          {error && <p className='text-red-500 text-xs md:col-span-2'>{error}</p>}

          <div className="md:col-span-2 mt-2">
            <button type='submit' className='btn-primary w-full py-3'>
              SIGN UP
            </button>
            <p className='text-[13px] text-slate-800 mt-4 text-center'>
              Already have an account?{" "}
              <button 
                type="button"
                className='font-medium text-primary underline cursor-pointer'
                onClick={()=> {
                  setCurrentPage("login")
                }}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUp

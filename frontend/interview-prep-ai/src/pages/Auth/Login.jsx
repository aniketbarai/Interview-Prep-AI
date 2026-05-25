import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import Input from '../../components/Input/Input'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = ({ setCurrentPage }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  if(!validateEmail(email)) {
    setError("Please enter a valid email address.")
    return;
  }
  if(!password) {
    setError("Plesase enter the password.")
    return;
  }
setError("")
// login api call
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
      email,password
    });
    const { token } = response.data;
    if(token){
      localStorage.setItem("token",token);
      updateUser(response.data)
      navigate("/dashboard");
    }
  } catch (error) {
      setError(error.response.data.message)
  }
  
  }
      useEffect(() => {
    // Disable scroll when the component mounts
    document.body.style.overflow = 'hidden';
  
    // Re-enable scroll when the component unmounts (cleanup function)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mb-6">
        Please enter your details to log in
      </p>
      <form onSubmit={handleLogin}>
        <Input 
          value={email}
          onChange={({target})=> setEmail(target.value)}
          label = "Email Address"
          placeholder="john@example.com"
          type="text" />
        <Input 
          value={password}
          onChange={({target})=> setPassword(target.value)}
          label = "Password"
          placeholder="Min 8 Characters"
          type="password" />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit'
            className='btn-primary'
          >
            Login
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <button className='font-medium text-primary underline cursor-pointer'
              onClick={()=> {
                setCurrentPage("signup")
              }}
            >
              SignUp
            </button>
          </p>
      </form>
    </div>
  )
}

export default Login

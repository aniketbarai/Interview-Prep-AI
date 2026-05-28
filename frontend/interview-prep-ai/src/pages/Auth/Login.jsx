import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import Input from '../../components/Input/Input'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import GoogleButton from './GoogleButton';

const Login = ({ setCurrentPage }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return;
    }
    if(!password) {
      setError("Please enter the password.")
      return;
    }

    setError("")
    setIsLoading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token } = response.data;
      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data)
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to log in. Please try again.")
    } finally {
      setIsLoading(false)
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
      <div className='flex flex-col items-center gap-5'>
        <GoogleButton />
        <h2 className='text-gray-600'>OR</h2>
      </div>
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

          <button
            type='submit'
            disabled={isLoading}
            className={`btn-primary flex items-center justify-center transition duration-200 ease-in-out ${isLoading ? 'opacity-70 cursor-not-allowed bg-slate-900/90 hover:bg-slate-900/90 hover:text-white' : 'hover:shadow-orange-600/20'}`}
          >
            {isLoading && (
              <span className='inline-flex items-center justify-center h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2' />
            )}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {isLoading && (
            <p className='text-[13px] text-slate-600 mt-2'>Verifying your credentials...</p>
          )}

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <button className='font-medium text-primary underline cursor-pointer'
              type='button'
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

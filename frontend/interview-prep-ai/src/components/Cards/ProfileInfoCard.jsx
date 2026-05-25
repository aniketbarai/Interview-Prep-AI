import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
    const { user,clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.clear()
        clearUser();
        navigate("/")
    }
  return (
    <div className="flex items-center">
        <img src={user?.profileImageUrl} 
        alt=""
        className='w-11 h-11 bg-gray-300 rounded-full mr-3'
        />
        <div>
            <div className="">
                {user?.name || ""}
            </div>
            <button
            className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline'
            onClick={handleLogOut}
            >
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfoCard

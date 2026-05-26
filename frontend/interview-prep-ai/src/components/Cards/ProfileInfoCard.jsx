import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar'

const ProfileInfoCard = () => {
    const { user,clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.clear()
        clearUser();
        navigate("/")
    }
  return (
    <div className="flex items-center gap-3">
        <Avatar
          name={user?.name || ''}
          image={user?.profileImageUrl || ''}
          size="md"
          className="mr-3"
        />
        <div>
            <div className="text-sm font-medium text-slate-900">
                {user?.name || "User"}
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

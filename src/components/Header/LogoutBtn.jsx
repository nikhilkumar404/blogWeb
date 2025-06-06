import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='bg-blue-500 inline-block px-6 py-2 duration-200 hover:bg-blue-300 rounded-full hover:scale-113 transform'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <>
    <Header/>   
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-10 text-center">
        <Outlet/>
        <div className="w-[95%] h-1 bg-blue-600 mx-auto my-6 rounded"></div>
        <Footer />
      </main>
      
    </div>
    </>
    

  ) : null
}

export default App
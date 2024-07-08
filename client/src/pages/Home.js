import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import SplitType from 'split-type'
import gsap from 'gsap'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  let text = new SplitType('#text')

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const response = await axios({
        url: URL,
        withCredentials: true,
      })

      dispatch(setUser(response.data.data))

      if (response.data.data.logout) {
        dispatch(logout())
        navigate('/email')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  // socket connection
  useEffect(() => {
    const socketConnection = io(
      process.env.REACT_APP_BACKEND_URL,
      {
        auth: {
          token: localStorage.getItem('token'),
        },
      }
    )

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const basePath = location.pathname === '/'

  let characters = document.querySelectorAll('.char')
  for (let i = 0; i < characters.length; i++) {
    characters[i].classList.add('translate-y-full')
  }

  gsap.to('.char', {
    y: 0,
    stagger: 0.05,
    delay: 0.1,
    duration: 0.2,
    repeat: 2,
    yoyo: true,
  })
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section
        className={`bg-white ${
          !basePath && 'hidden'
        } lg:block`}
      >
        <Sidebar />
      </section>
      <section className={`${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-1 hidden ${
          !basePath ? 'hidden' : 'lg:flex'
        }`}
      >
        <p
          id='text'
          className='text-6xl mt-2 text-slate-900 uppercase'
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          Start Chatting!!!
        </p>
      </div>
    </div>
  )
}

export default Home

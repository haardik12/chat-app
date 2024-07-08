import React, { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
// import { LuUser } from 'react-icons/lu'
import Avatar from '../components/Avatar'
import { useDispatch } from 'react-redux'
import { setToken } from '../redux/userSlice'

const PasswordVerify = () => {
  const [data, setData] = useState({
    password: '',
    userId: '',
  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      })
      console.log('response', response)

      toast.success(response.data.message)

      if (response.data.success) {
        dispatch(setToken(response.data.token))
        localStorage.setItem('token', response.data.token)
        setData({
          password: '',
        })

        navigate('/')
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred'
      toast.error(errorMessage)
    }
  }

  return (
    <div className='mt-10'>
      <div className='bg-white w-full max-w-lg rounded-lg overflow-hidden p-4 mx-auto shadow-lg shadow-stone-400'>
        <div className='w-fit mx-auto mb-5 flex justify-center items-center flex-col'>
          {/* <LuUser size={85} /> */}
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
            className='rounded-lg'
          />

          <h2 className='font-semibold mt-6 text-lg'>
            {location?.state?.name}
          </h2>
        </div>

        <h3 className='text-2xl font-semibold text-gray-800 mt-1 mb-4 text-center'>
          Login
        </h3>

        <form
          action=''
          className='grid gap-5 mt-10'
          onSubmit={handleSubmit}
        >
          {/* email input  */}

          <div className='flex flex-col gap-2'>
            <label htmlFor='password'>Password : </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-gray-50 px-2 py-1 focus: outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          {/* rgeister button */}
          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white shadow-md shadow-red-600'>
            Login
          </button>
        </form>

        <p className='my-6 text-center'>
          Forgot your password?
          <Link
            to={'/forgot-password'}
            className='hover:text-primary hover:underline font-semibold ml-2'
          >
            Click here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default PasswordVerify

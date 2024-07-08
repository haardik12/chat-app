import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LuUser } from 'react-icons/lu'

const EmailVerify = () => {
  const [data, setData] = useState({
    email: '',
  })

  const navigate = useNavigate()

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data)
      console.log('response', response)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          email: '',
        })

        navigate('/password', {
          state: response.data.data,
        })
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
        <div className='w-fit mx-auto mb-5'>
          <LuUser size={85} />
        </div>

        <h3 className='text-2xl font-semibold text-gray-800 mt-6 mb-4 text-center'>
          Login
        </h3>

        <form
          action=''
          className='grid gap-5 mt-10'
          onSubmit={handleSubmit}
        >
          {/* email input  */}

          <div className='flex flex-col gap-2'>
            <label htmlFor='email'>Email : </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-gray-50 px-2 py-1 focus: outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          {/* rgeister button */}
          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white shadow-md shadow-red-600'>
            VERIFY EMAIL
          </button>
        </form>

        <p className='my-6 text-center'>
          Don't have an Account?
          <Link
            to={'/register'}
            className='hover:text-primary hover:underline font-semibold ml-2'
          >
            Sign Up/Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmailVerify

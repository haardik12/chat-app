import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import uploadFile from '../helpers/uploadFile'
import axios from 'axios'
import toast from 'react-hot-toast'

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: '',
  })

  const [uploadPhoto, setUploadPhoto] = useState('')
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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setUploadPhoto(file)

    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      }
    })
  }

  const handleClearUplaodPhoto = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadPhoto(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL, data)
      console.log('response', response)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          name: '',
          email: '',
          password: '',
          profile_pic: '',
        })

        navigate('/email')
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
        <h3>Create your account</h3>

        <form
          action=''
          className='grid gap-5 mt-10'
          onSubmit={handleSubmit}
        >
          {/* name input  */}

          <div className='flex flex-col gap-2'>
            <label htmlFor='name'>Name : </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='bg-gray-50 px-2 py-1 focus: outline-primary'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

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

          {/* password input  */}

          <div className='flex flex-col gap-2'>
            <label htmlFor='password'>Password: </label>
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

          {/* profile photo input  */}

          <div className='flex flex-col gap-2'>
            <label htmlFor='profile_pic'>
              Photo :
              <div className='h-14 bg-gray-50 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                <p className='text-sm max-w-[300] text-ellipsis line-clamp-1'>
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : 'Upload Profile Photo'}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className='text-lg ml-2 hover:text-red-600'
                    onClick={handleClearUplaodPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='bg-gray-50 px-2 py-1 focus: outline-primary hidden'
              onChange={handleUploadPhoto}
            />
          </div>

          {/* rgeister button */}
          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white shadow-md shadow-red-600'>
            REGISTER
          </button>
        </form>

        <p className='my-6 text-center'>
          Already have an Account ?
          <Link
            to={'/email'}
            className='hover:text-primary hover:underline font-semibold ml-2'
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

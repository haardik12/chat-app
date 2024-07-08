import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import { FaImage, FaVideo } from 'react-icons/fa6'
import uploadFile from '../helpers/uploadFile'
import { IoClose } from 'react-icons/io5'
import Loading from './Loading'
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoSend } from 'react-icons/io5'
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  )
  const user = useSelector((state) => state?.user)
  const [dataUser, setDataUser] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: '',
  })

  const [openAdd, setOpenAdd] = useState(false)
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  })

  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef()

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [allMessage])

  const handleAddButton = () => {
    setOpenAdd((preve) => !preve)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    setLoading(true)

    const uploadPhoto = await uploadFile(file)

    setLoading(false)
    setOpenAdd(false)

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: '',
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    setLoading(true)

    const uploadPhoto = await uploadFile(file)

    setLoading(false)
    setOpenAdd(false)

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: '',
      }
    })
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message page', params.userId)

      socketConnection.emit('seen', params.userId)

      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        setAllMessage(data)
      })
    }
  }, [socketConnection, params?.userId, user])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (
      message.text ||
      message.imageUrl ||
      message.videoUrl
    ) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        })
        setMessage({
          text: '',
          imageUrl: '',
          videoUrl: '',
        })
      }
    }
  }

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className='bg-no-repeat bg-cover'
    >
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-5 py-1'>
          <Link to={'/'} className='lg:hidden'>
            <IoArrowBack size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1 capitalize'>
              {dataUser?.name}
            </h3>
            <p className='-my-1 text-sm'>
              {dataUser.online ? (
                <span className='text-green-600 font-serif font-medium'>
                  online
                </span>
              ) : (
                <span className='text-slate-400'>
                  offline
                </span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className='cursor-pointer'>
            <HiDotsVertical size={25} />
          </button>
        </div>
      </header>

      {/* show all messages */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-300 bg-opacity-80'>
        {/* all messages shown */}
        <div
          className='flex flex-col items-start gap-2 mt-4'
          ref={currentMessage}
        >
          {allMessage.map((msg, index) => {
            const isSender = user._id === msg?.msgByUserId
            const displayName = isSender
              ? user.name
              : dataUser.name
            return (
              <div
                className={`flex items-start gap-2.5 mb-3 max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user._id === msg?.msgByUserId
                    ? 'mr-8 ml-auto'
                    : 'ml-8'
                }`}
              >
                <div className='w-full relative'>
                  {/* this section for images */}
                  {msg?.imageUrl && (
                    <div className='flex flex-col gap-1 w-full max-w-[320px]'>
                      <div
                        className={`flex flex-col leading-1.5 p-3 border-gray-200 bg-primary ${
                          user._id === msg?.msgByUserId
                            ? 'bg-white text-primary'
                            : ''
                        }`}
                      >
                        <img
                          src={msg?.imageUrl}
                          alt=''
                          className={`text-sm font-medium text-white ${
                            user._id === msg?.msgByUserId
                              ? '!text-red-500'
                              : ''
                          }`}
                        />
                      </div>

                      {/* <span class='text-sm font-normal text-gray-500 dark:text-gray-400'>
                    Delivered
                  </span> */}
                    </div>
                  )}

                  {/* this section for videos */}

                  {msg?.videoUrl && (
                    <div className='flex flex-col gap-1 w-full max-w-[320px]'>
                      <div
                        className={`flex flex-col leading-1.5 p-3 border-gray-200 bg-primary ${
                          user._id === msg?.msgByUserId
                            ? 'bg-white text-primary'
                            : ''
                        }`}
                      >
                        <video
                          src={msg.videoUrl}
                          className={`text-sm font-medium text-white object-scale-down ${
                            user._id === msg?.msgByUserId
                              ? '!text-red-500'
                              : ''
                          }`}
                          controls
                        />
                      </div>

                      {/* <span class='text-sm font-normal text-gray-500 dark:text-gray-400'>
                    Delivered
                  </span> */}
                    </div>
                  )}

                  {/* this section for text messages */}
                  <imageUrl
                    className='w-8 h-8 rounded-full'
                    src={dataUser?.profile_pic}
                  />
                  <div className='flex flex-col gap-1 w-full max-w-[320px]'>
                    <div
                      className={`flex flex-col leading-1.5 p-3 border-gray-200 bg-primary rounded-br-xl rounded-bl-xl ${
                        user._id === msg?.msgByUserId
                          ? 'bg-white text-primary'
                          : ''
                      }`}
                    >
                      <p
                        className={`text-sm mb-2 font-medium text-white ${
                          user._id === msg?.msgByUserId
                            ? '!text-red-500'
                            : ''
                        }`}
                      >
                        {msg.text}
                      </p>

                      <div className='flex justify-between items-center space-x-4 rtl:space-x-reverse'>
                        <span className='text-xs font-medium text-gray-900'>
                          {displayName}
                        </span>
                        <span
                          className={`text-sm font-normal text-gray-100 ${
                            user._id === msg?.msgByUserId
                              ? '!text-black'
                              : ''
                          }`}
                        >
                          {moment(msg.createdAt).format(
                            'hh:mm'
                          )}
                        </span>
                      </div>
                    </div>

                    {/* <span class='text-sm font-normal text-gray-500 dark:text-gray-400'>
                    Delivered
                  </span> */}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* uploaded images display */}
        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden'>
            <div
              className='w-fit p-2 absolute top-0 right-0 cursor-pointer'
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img
                src={message.imageUrl}
                alt='uploadimage'
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
              />
            </div>
          </div>
        )}
        {/* uploaded videos display */}
        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden'>
            <div
              className='w-fit p-2 absolute top-0 right-0 cursor-pointer'
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video
                src={message.videoUrl}
                className='aspect-video w-full h-full max-w-sm m-2 object-scale-down'
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
            <Loading />
          </div>
        )}
      </section>

      {/* send message */}
      <section className='h-16 bg-white flex items-center'>
        <div className='relative'>
          <button
            onClick={handleAddButton}
            className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'
          >
            <IoMdAdd size={25} />
          </button>

          {/* video and image */}
          {openAdd && (
            <div className='bg-white shadow rounded absolute bottom-16 w-36 p-2 ml-2'>
              <form>
                <label
                  htmlFor='uploadImage'
                  className='flex items-center p-2 px-3 gap-3 hover:bg-slate-100 hover:text-primary cursor-pointer'
                >
                  <div className='hover:text-primary'>
                    <FaImage size={25} />
                  </div>
                  <p>Photos</p>
                </label>

                <label
                  htmlFor='uploadVideo'
                  className='flex items-center p-2 px-3 gap-3 hover:bg-slate-100 hover:text-primary cursor-pointer'
                >
                  <div className='hover:text-primary'>
                    <FaVideo size={25} />
                  </div>
                  <p>Videos</p>
                </label>
              </form>

              <input
                type='file'
                id='uploadImage'
                onChange={handleUploadImage}
                className='hidden'
              />
              <input
                type='file'
                id='uploadVideo'
                onChange={handleUploadVideo}
                className='hidden'
              />
            </div>
          )}
        </div>

        {/* input box */}
        <form
          className='py-2 px-2 w-full h-full flex gap-2'
          onSubmit={handleSendMessage}
        >
          <input
            type='text'
            placeholder='Message...'
            className='py-1 px-4 outline-none w-full h-full rounded-lg bg-yellow-100'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-primary hover:text-secondary'>
            <IoSend size={25} className='mr-3' />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage

import React, { useEffect, useState } from 'react'
import { MdChat } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa6'
import { LuLogOut } from 'react-icons/lu'
import { NavLink, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { useDispatch, useSelector } from 'react-redux'
import EditUserDetails from './EditUserDetails'
import { IoMdAdd } from 'react-icons/io'
import '../App.css'
import SearchUser from './SearchUser'
import { FaImage } from 'react-icons/fa6'
import { FaVideo } from 'react-icons/fa6'
import { logout } from '../redux/userSlice'

const Sidebar = () => {
  const user = useSelector((state) => state?.user)
  const [profileEditOpen, setProfileEditOpen] =
    useState(false)

  const [allUser, setAllUser] = useState([])

  const [openSearchUser, setOpenSearchUser] =
    useState(false)

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('sidebar', user._id)

      socketConnection.on('conversation', (data) => {
        console.log('conversation', data)

        const conversationUserData = data.map(
          (conversationUser, index) => {
            if (
              conversationUser?.sender?._id ===
              conversationUser?.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.sender,
              }
            } else if (
              conversationUser?.receiver?._id !== user?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser.receiver,
              }
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              }
            }
          }
        )
        setAllUser(conversationUserData)
      })
    }
  }, [socketConnection, user])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/email')
    localStorage.clear()
  }

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
      <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between'>
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-11 h-11 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md ${
                isActive && 'bg-slate-200'
              }`
            }
            title='chats'
          >
            <MdChat size={25} />
          </NavLink>

          <div
            className='w-11 h-11 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md'
            title='Add friend'
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <button
            className='mb-4'
            title={user.name}
            onClick={() => {
              setProfileEditOpen(true)
            }}
          >
            <Avatar
              width={35}
              height={35}
              name={user.name}
              imageUrl={user.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            className='w-11 h-11 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md'
            title='logout'
            onClick={handleLogout}
          >
            <LuLogOut size={25} />
          </button>
        </div>
      </div>

      <div className='w-full '>
        <div className='h-16 flex items-center'>
          <h2 className='text-xl font-bold p-4 text-slate-800'>
            Chats
          </h2>
        </div>
        <div className='bg-slate-200 p-[0.5px]'></div>

        <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
          {allUser.length === 0 && (
            <div className='flex flex-col justify-center items-center mt-60'>
              <div className='flex justify-center items-center my-4 text-slate-600'>
                <IoMdAdd size={50} />
              </div>
              <p className='text-lg text-center text-slate-400'>
                Explor and start chatting
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={'/' + conv?.userDetails?._id}
                key={conv?._id}
                className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'
              >
                <div>
                  <Avatar
                    imageUrl={
                      conv?.userDetails?.profile_pic
                    }
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>
                    {conv?.userDetails?.name}
                  </h3>
                  <div className='text-slate-500 text-xs flex items-center gap-1'>
                    <div className='flex items-center gap-1'>
                      {conv?.lastMsg?.imageUrl && (
                        <div className='flex items-center gap-1'>
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && (
                            <span>Image</span>
                          )}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className='flex items-center gap-1'>
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && (
                            <span>Video</span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className='text-ellipsis line-clamp-1'>
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* edit user details */}
      {profileEditOpen && (
        <EditUserDetails
          onClose={() => setProfileEditOpen(false)}
          user={user}
        />
      )}

      {/* serach friends */}
      {openSearchUser && (
        <SearchUser
          onClose={() => setOpenSearchUser(false)}
        />
      )}
    </div>
  )
}

export default Sidebar

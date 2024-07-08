import React from 'react'
import { LuUser } from 'react-icons/lu'
import { useSelector } from 'react-redux'

const Avatar = ({
  userId,
  name,
  imageUrl,
  width,
  height,
}) => {
  const onlineUser = useSelector(
    (state) => state?.user?.onlineUser
  )

  let avatarName = ''

  if (name) {
    const splitName = name?.split(' ')

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0]
    } else {
      avatarName = splitName[0][0]
    }
  }

  const isOnline = onlineUser.includes(userId)
  return (
    <div
      className={`text-slate-800 rounded-full shadow-md shadow-slate-500 relative`}
      style={{ width: width + 'px', height: height + 'px' }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className='overflow-hidden rounded-full'
        />
      ) : name ? (
        <div
          style={{
            width: width + 'px',
            height: height + 'px',
          }}
          className='overflow-hidden rounded-full flex justify-center items-center'
        >
          {avatarName}
        </div>
      ) : (
        <LuUser size={width} />
      )}

      {isOnline && (
        <div className='bg-green-500 p-1 absolute bottom-1 right-0 rounded-full z-10 text-lg h-2 w-2'></div>
      )}
    </div>
  )
}

export default Avatar

import React, { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import Loading from './Loading'
import UserSearchCard from './UserSearchCard'
import toast from 'react-hot-toast'
import axios from 'axios'
import { IoCloseSharp } from 'react-icons/io5'

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearchuser = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
    try {
      setLoading(true)
      const response = await axios.post(URL, {
        search: search,
      })
      setLoading(false)

      setSearchUser(response.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  useEffect(() => {
    handleSearchuser()
  }, [search])

  console.log('search', searchUser)
  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 bg-slate-700 bg-opacity-40 p-6 z-10'>
      <div className='w-full max-w-md mx-auto mt-16'>
        {/* input for searching friends */}
        <div className='bg-white rounded-xl h-14 overflow-hidden flex'>
          <input
            type='text'
            placeholder='search by username or email...'
            className='w-full outline-none py-3 h-full px-4'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />

          <div className='h-14 w-14 flex justify-center items-center'>
            <IoSearch size={20} />
          </div>
        </div>

        {/* results after searching */}
        <div className='bg-white mt-2 w-full p-4 rounded-xl max-h-[440px] overflow-x-hidden overflow-y-scroll scrollbar'>
          {/* if no user found */}
          {searchUser.length === 0 && !loading && (
            <p className='text-center text-slate-500'>
              No users found &#58;&#40;
            </p>
          )}

          {loading && (
            <p>
              <Loading />
            </p>
          )}

          {/* if user found */}
          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard
                  key={user._id}
                  user={user}
                  onClose={onClose}
                />
              )
            })}
        </div>
      </div>

      <div
        className='absolute text-2xl top-0 right-0 p-2 lg:text-4xl'
        onClick={onClose}
      >
        <button>
          <IoCloseSharp />
        </button>
      </div>
    </div>
  )
}

export default SearchUser

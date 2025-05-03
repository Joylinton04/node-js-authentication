import React from 'react'
import images from '../assets/assets'
import assets from '../assets/assets';

const Navbar = () => {
  return (
    <div className='w-full p-8 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <img src={images.logo} alt="" />
      </div>
      <button className='rounded-full px-6 py-3 flex items-center gap-2 border hover:bg-gray-50 transition-all'>
        <span className='text-base'>Login</span>
        <span><img src={assets.arrow_icon} alt="" /></span>
      </button>
    </div>
  )
}

export default Navbar;
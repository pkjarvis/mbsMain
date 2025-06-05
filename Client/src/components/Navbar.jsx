import React from 'react'

const Navbar = (props) => {
  return (
    <div>
        <div className="navbar  flex items-center justify-start my-2 ">
          <img src="../src/assets/Logo.png" alt="Logo" className="w-12 h-12 mx-6 "/>
          {/* <span className='searchBar flex items-center  justify-between w-[50vw] border-1 rounded-2xl px-3 py-2  border-gray-400'>
            <p className='text-gray-500 font-[inter] font-normal leading-1'>{props.para}</p>
            <img src="../src/assets/searchIcon.png" alt="searchIcon" className="w-[1.2vw] h-[1.2vw]"/>
          </span> */}
          <input type="text" placeholder={props.para}  className="border-1 rounded-3xl w-[60vw] px-3 py-2 border-gray-400 outline-none">
           </input>
           <img src="../src/assets/searchIcon.png" alt="Icon" className="w-[1.2vw] h-[1.2vw] relative ml-[-2rem]" />
          <span className="user flex items-center justify-between gap-2 ml-[18vw] px-4">

             <p className='text-gray-700 font-[inter] text-xl font-medium leading-1'>New Delhi</p>
             <img src="../src/assets/dropDownIcon.png" alt="DropDown" className="w-3 h-2" />
             <img src="../src/assets/ei_user.png" alt="User" className="w-10 h-10 ml-3" />
             <p className='text-gray-700 text-xl font-[inter] font-medium leading-1'>Hi, Rahul</p>

          </span>

        </div>
    </div>
  )
}

export default Navbar
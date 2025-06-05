import React from 'react'
import Navbar from '../components/Navbar' 




const AddNewTheatre = () => {
  return (
    <div>
        <div className="theatre-info">
            <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
            <span className="flex items-center gap-2 mx-6 ">
            <a href="http://localhost:5173/dashboard"><p className="text-zinc-400 font-light text-md">Home /</p></a>
            <a href="http://localhost:5173/theatre"><p className="text-zinc-400 font-light text-md">Theatre Management /</p></a>
            <p className="font-light text-sm">Add New Theatre</p>
           </span>
           <div className="info flex flex-col place-items-center mt-[1.8vw]">
            <div className="flex flex-col justify-between gap-2">
              <p className='font-semibold text-base'>Basic Info</p>
              <input type="text" placeholder='Theatre Name' required className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"/>
              <textarea type="text" placeholder='Theatre Address' required className="w-[30vw] h-[8vw]  border-1 border-gray-300 p-2  rounded-sm mb-1 outline-none "/>
              <div className='flex items-center justify-between mb-1'>
                <div contentEditable="true" className='w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>City Name</p>
                    
                </div>
                <div  contentEditable="true" className='w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>State Name</p>
                   
                </div>
                
              </div>

              <div  className='flex items-center justify-between mb-1'>
                <div contentEditable="true" className='w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>Status</p>
    
                </div>
                <div contentEditable="true" className='w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>Total No. Of Screens</p>
                    
                </div>
                
              </div>
              <div contentEditable="true" className='w-[30vw] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between mb-1'>
                    <p className='text-sm text-gray-500'>Current Movies</p>
              </div>
              <p className="font-semibold text-zinc-600 text-base mb-1">Upload Theatre Icon</p>
              <div className="w-[6vw] h-[6vw] flex flex-col items-center justify-center gap-4 border-1 border-dashed border-zinc-400 rounded-sm px-auto mb-1">
                <img src="../src/assets/Upload.png" alt="Upload.png" className='w-[1.4vw] h-[1.4vw]' />
                <p className=' text-gray-500 text-sm'>Upload file here</p>
              </div>
              <div className='buttons flex items-center justify-start gap-5 mb-1 opacity-15'>
                 <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-sm">Add</button>
                 <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-sm text-zinc-700" >Cancel</button>
                 
              </div>
            </div>
              
           </div>
        </div>
    </div>
  )
}

export default AddNewTheatre
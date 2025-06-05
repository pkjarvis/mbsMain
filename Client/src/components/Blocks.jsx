import React from 'react'

const Blocks = (props) => {
  return (
    <div className='border-2 p-3 rounded-md border-zinc-500 my-2'>
        <div className="block-container flex items-center justify-center gap-6">
            <img src={props.icon} alt="GoogleLogo" className="w-6" />
            <p className='text-2xl text-gray-600 font'>Continue with {props.name}</p>
        </div>
    </div>
  )
}

export default Blocks
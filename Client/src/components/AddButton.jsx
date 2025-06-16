import React from 'react'

const AddButton = (props) => {
  return (
   <div className="button-container cursor-pointer h-[1.8vw] w-[auto]   flex items-center text-wrap  p-3 text-base text-pink-500 font-[Inter] border-1 border-pink-500 font-semibold rounded-xl justify-center">
        {props.title}
    </div>
        
        
  )
}

export default AddButton
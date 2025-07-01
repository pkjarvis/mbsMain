import React from 'react'
const baseUrl= import.meta.env.VITE_ROUTE
const Button = (props) => {
  return (
    <div className="button-container cursor-pointer h-[1.8vw] w-[8vw]  bg-pink-500  flex items-center  p-3 text-sm text-white font-[Inter] font-semibold rounded-xl justify-center">
        {
        props.title=="Go to Movies"
        ?<a href={baseUrl+"/movie"}>{props.title}</a>
        :props.title=="Manage Theatres"
        ?<a href={baseUrl+"/theatre"}>{props.title}</a>
        :<a href={baseUrl+"/shows"}>{props.title}</a>
        }
        
    </div>
  )
}

export default Button
import React from 'react'
import { Link } from 'react-router-dom'
const baseUrl= import.meta.env.VITE_ROUTE
const Button = (props) => {
  return (
    <div className="button-container cursor-pointer h-[1.8vw] w-[8vw]  bg-pink-500  flex items-center  p-3 text-sm text-white font-[Inter] font-semibold rounded-xl justify-center">
        {
        props.title=="Go to Movies"
        ?<Link to="/movie">{props.title}</Link>
        :props.title=="Manage Theatres"
        ?<Link to="/theatre">{props.title}</Link>
        :<Link to="/shows">{props.title}</Link>
        }
        
    </div>
  )
}

export default Button
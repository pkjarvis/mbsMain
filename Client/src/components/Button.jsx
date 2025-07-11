import React from 'react'
import { Link } from 'react-router-dom'
const baseUrl= import.meta.env.VITE_ROUTE
const Button = (props) => {
  return (
    <div className="button-container cursor-pointer h-[1.8vw] w-[8vw]  bg-[#FF5295]  flex items-center  p-3 text-sm text-white font-[Inter] font-semibold rounded-xl justify-center">
        {
        props.title=="Go to Movies"
        ?<Link to="/admin-movie">{props.title}</Link>
        :props.title=="Manage Theatres"
        ?<Link to="/admin-theatre">{props.title}</Link>
        :<Link to="/admin-shows">{props.title}</Link>
        }
        
    </div>
  )
}

export default Button
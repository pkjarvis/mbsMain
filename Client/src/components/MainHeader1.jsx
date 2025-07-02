import React from 'react'
import NavBar1 from './NavBar1'
const baseUrl = import.meta.env.VITE_ROUTE;

const MainHeader1 = (props) => {
  return (
     <div className="theatre-container font-[Inter]">
            <NavBar1 />
            <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
                <a href={baseUrl+"/dashboard"} className='cursor-pointer font-light text-zinc-500 '>Home / </a>
                <a href={baseUrl+"/movie"} className='cursor-pointer font-light text-zinc-500'>{props.headerlink} </a>
                <a href={baseUrl+"/showtime"} className='cursor-pointer'> {props.nextlink}</a>
            </span> 

        </div>
  )
}

export default MainHeader1
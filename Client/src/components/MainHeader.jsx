import React from 'react'
import Navbar from './Navbar'
import AddButton from './AddButton'
const baseUrl=import.meta.env.VITE_ROUTE
const MainHeader = (props) => {
  return (
    
     <div className="theatre-container font-[Inter]">
            <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
            <span className="flex items-center justify-start ml-6 gap-1">
                <a href={baseUrl+"/dashboard"} className='cursor-pointer font-light text-zinc-500 '>Home / </a>
                <a href={baseUrl+"/movie"} className='cursor-pointer'>{props.headerlink}</a>
            </span>
            <span className="flex items-center justify-between mx-6">
                <h2 className="font-bold text-2xl">{props.title}</h2>
                <a href={props.btnlink}>
                    <AddButton title={props.btncontent} /> 
                </a>
            </span>
           
            

        </div>
    
  )
}

export default MainHeader
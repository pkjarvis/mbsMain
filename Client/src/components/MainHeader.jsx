import React from 'react'
import Navbar from './Navbar'
import AddButton from './AddButton'
import { Link } from 'react-router-dom'
const baseUrl=import.meta.env.VITE_ROUTE
const MainHeader = (props) => {
  return (
    
     <div className="theatre-container font-[Inter]">
            <Navbar para="Find showtimes by Movie, Theatre, Date, etc." onSearch={props.onSearch} searchValue={props.searchValue}/>
            <span className="flex items-center justify-start ml-6 gap-1">
                <Link to="/admin-dashboard" className='cursor-pointer font-light text-zinc-500 '>Home / </Link>
                <Link to="/admin-movie" className='cursor-pointer'>{props.headerlink}</Link>
            </span>
            <span className="flex items-center justify-between mx-6">
                <h2 className="font-bold text-2xl">{props.title}</h2>
                <Link to={props.btnlink}>
                    <AddButton title={props.btncontent} /> 
                </Link>
            </span>
           
            

        </div>
    
  )
}

export default MainHeader
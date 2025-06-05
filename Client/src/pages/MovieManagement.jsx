import React from 'react'
import Navbar from '../components/Navbar'
import AddButton from '../components/AddButton'
import MovieCard from '../components/MovieCard'
import MainHeader from '../components/MainHeader'


const MovieManagement = () => {
  return (
    <div>
        {/* <div className="movie-container font-[Inter]">
            <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
            <span className="flex items-center justify-start ml-6">
                <a href="http://localhost:5173/dashboard" className='cursor-pointer font-light '>Home / </a>
                <a href="http://localhost:5173/movie" className='cursor-pointer'>Movie Management</a>
            </span>
            <span className="flex items-center justify-between mx-6">
                <h2 className="font-bold text-2xl">Manage Movies</h2>
                <AddButton title="+Add Movies" /> 
            </span>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            

        </div> */}
        <div>

        <MainHeader title="Manage Movies" btncontent="+Add New Movie" headerlink="Movie Management" btnlink="http://localhost:5173/addnewmovie"/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
        </div>
    </div>
  )
}

export default MovieManagement
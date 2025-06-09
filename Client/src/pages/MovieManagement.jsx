import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import AddButton from '../components/AddButton'
import MovieCard from '../components/MovieCard'
import MainHeader from '../components/MainHeader'
import { MoviesContext } from '../context/MovieContext'


const MovieManagement = () => {

    const {movies}=useContext(MoviesContext);
    // if(!movies.length) return <p>No movies added yet.</p>

  return (
    <div>
        <div>

        <MainHeader title="Manage Movies" btncontent="+Add New Movie" headerlink="Movie Management" btnlink="http://localhost:5173/addnewmovie"/>
        {
            movies.map((m)=>(
                <MovieCard
                    key={m.id}
                    id={m.id}
                    movie={m.movie}
                    description={m.description}
                    startDate={m.startDate}
                    endDate={m.endDate}
                    genre={m.genre}
                    language={m.language}
                    status={m.status}
                    file={m.file}

                
                />
            ))
        }
            {/* <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>
            <MovieCard/>     */}
        </div>
    </div>
  )
}

export default MovieManagement
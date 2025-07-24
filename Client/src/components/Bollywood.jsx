import React from 'react'
import MovieCard1 from './MovieCard1'
import { Link } from 'react-router-dom'


const Bollywood = ({shows=[]}) => {
  return (
    <div className='mx-[3vw] mt-[3.6vw] bg-white'>
        <div className="bollywood-container">
            <span className='flex items-center justify-between'>
                <h1 className='font-bold text-3xl'>Upcoming Shows</h1>
                <Link to="/movies" className='underline text-zinc-400'>see all</Link>
            </span>
            <div className='grid grid-cols-4 gap-[3vw] mt-2'>
                {/* <MovieCard imgURL={"../src/assets/aliceWonderland.png"}/>
                <MovieCard imgURL={"../src/assets/aliceWonderland.png"}/>
                <MovieCard imgURL={"../src/assets/aliceWonderland.png"}/>
                <MovieCard imgURL={"../src/assets/aliceWonderland.png"}/> */}
                {shows.map((show) => (
                  <MovieCard1 key={show?.ID} showsData={show} />
                ))}
               
            </div>
        </div>
    </div>
  )
}

export default Bollywood
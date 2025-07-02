import React from 'react'
import TheatreCard1 from './TheatreCard1'

const NowShowingTheatre = () => {
  return (
    <div>
        <div className="movie-showing-theatre mx-[3vw] h-[40vw] bg-white">
            <span className='flex items-center justify-between'>
                <p className='text-3xl font-bold'>Now Showing in Theatres</p>
                <a href="#" className='underline text-gray-500'>see all </a>
            </span>
            <div className='flex items-center justify-between'>
                <TheatreCard1/>
                <TheatreCard1/>
                <TheatreCard1/>
            </div>
        </div>
    </div>
  )
}

export default NowShowingTheatre
import React from 'react'
import Navbar from '../components/Navbar'
import MainHeader from '../components/MainHeader'
import ShowTimeCard from '../components/ShowTimeCard'

const Shows = () => {
  return (
    <div>
        <MainHeader title="Schedule Showtimes" btncontent="+Add New Showtime" headerlink="Showtime Scheduling" btnlink="http://localhost:5173/addnewshows"/>
        <ShowTimeCard/>
        <ShowTimeCard/>
        <ShowTimeCard/>
        <ShowTimeCard/>
        <ShowTimeCard/>
        <ShowTimeCard/>
        <ShowTimeCard/>
    </div>
  )
}

export default Shows
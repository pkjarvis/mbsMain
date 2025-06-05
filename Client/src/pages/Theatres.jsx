import React from 'react'
import Navbar from '../components/Navbar'
import AddButton from '../components/AddButton'
import MainHeader from '../components/MainHeader'
import TheatreCard from '../components/TheatreCard'

const Theatres = () => {
  return (
   <div>
       
        <MainHeader title="Manage Theatres" btncontent="+Add New Theatres" headerlink="Theatre Management" btnlink="http://localhost:5173/addnewtheatre" />
        <TheatreCard/>
        <TheatreCard/>
        <TheatreCard/>
        <TheatreCard/>
        <TheatreCard/>
        <TheatreCard/>
        

        
    </div>
  )
}

export default Theatres
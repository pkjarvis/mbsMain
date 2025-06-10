import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import AddButton from '../components/AddButton'
import MainHeader from '../components/MainHeader'
import TheatreCard from '../components/TheatreCard'
import { TheatreContext } from '../context/TheatreContext'

const Theatres = () => {

  const {theatres}=useContext(TheatreContext)

  return (
   <div>
       
        <MainHeader title="Manage Theatres" btncontent="+Add New Theatres" headerlink="Theatre Management" btnlink="http://localhost:5173/addnewtheatre" />
        {
          theatres.length>0?(theatres.map((t)=>(
            <TheatreCard
              key={t.id}
              id={t.id}
              theatrename={t.theatrename}
              address={t.address}
              cityName={t.cityName}
              stateName={t.stateName}
              status={t.status}
              totalscreens={t.totalscreens}
              theatrefile={t.theatrefile}
              value={t.value}


            />
          )))
          :(
            null
          )
        }
        
        
        
        
        

        
    </div>
  )
}

export default Theatres
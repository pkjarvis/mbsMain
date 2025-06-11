import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MainHeader from '../components/MainHeader'
import ShowTimeCard from '../components/ShowTimeCard'
import { ShowTimeContext } from '../context/ShowTimeContext'

// id:Date.now(),
//       theatrename:theatrename,
//       startDate:startDate,
//       moviename:moviename,
//       datetime12h:datetime12h,
//       datetime:datetime,
//       timearray:timearray,
//       selectedCities:selectedCities,

const Shows = () => {
  
  const {showtimes}=useContext(ShowTimeContext);
  return (
    <div>
        <MainHeader title="Schedule Showtimes" btncontent="+Add New Showtime" headerlink="Showtime Scheduling" btnlink="http://localhost:5173/addnewshows"/>
        {
          showtimes.length>0?
          (showtimes.map((s)=>(
            <ShowTimeCard
               key={s.id}
               id={s.id}
               startDate={s.startDate}
               theatrename={s.theatrename}
               moviename={s.moviename}
               datetime12h={s.datetime12h}
               datetime={s.datetime}
               timearray={s.timearray}
               language={s.language}
            />
          ))):(null)
        }
        
        
    </div>
  )
}

export default Shows
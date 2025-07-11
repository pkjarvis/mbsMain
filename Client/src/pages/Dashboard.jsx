import React from 'react'
import SearchBox from '../components/Navbar'
import DashboardCard from '../components/DashboardCard'
import DashboardNavbar from '../components/DashboardNavbar'
import DCard1 from '../assets/DCard1.png'
import DCard2 from '../assets/DCard2.png'
import DCard3 from '../assets/DCard3.png'

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
      <div className="content p-2">
        {/* <SearchBox para="Search your favourite movies"/> */}
        <DashboardNavbar />
      </div>
      <section className="main-content flex items-center justify-evenly my-[10vw] mx-[16vw]">
        <DashboardCard icon={DCard1} title="Movie Management" desc="Add or update movies, posters and metadata" buttonTitle="Go to Movies" />
        <DashboardCard icon={DCard2} title="Theatre Management" desc="Manage theatre details,screens and locations" buttonTitle="Manage Theatres" />
        <DashboardCard icon={DCard3} title="Showtime Scheduling" desc="Assign movies to screens and schedule showtimes." buttonTitle="Schedule Shows" />

      </section>
    </div>
  )
}


export default Dashboard
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Link, useNavigate } from 'react-router-dom';

const NavBar1 = (props) => {
  const [flag,setFlag]=useState(false);

  const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New Delhi', code: 'ND' },
        { name: 'Pune', code: 'PN' },
        { name: 'Agra', code: 'AGR' },
        { name: 'Hyderabad', code: 'HYD' },
        { name: 'Mumbai', code: 'MB' }
    ];
  const navigate=useNavigate(""); 


  const handleClick=()=>{
    setFlag(!flag);
  }

  const handleProfile=()=>{
    navigate("/profile");
  }
  
  return (
    <div className="flex items-center justify-center mt-[2vw]">

        <div className={`absolute w-[48%] h-[auto] bg-white top-[12vw] p-4 shadow-2xl z-10 ${flag===true?"":"hidden"}`}>
            <p className='text-xl font-semibold'>Select Location</p>
             <div className="card flex justify-content-center mt-3">
                <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" 
                placeholder="Select a City" className="w-full md:w-14rem" />
            </div>
            <span className='flex items-center my-3 gap-1'>
                <img src="/assets/location.png" alt="Location" className='w-[1.2vw] h-[1.2vw]' />
                <p className='text-[1vw] font-medium'>Use current location</p>
            </span>
            <p className='text-lg font-medium text-center mt-6'>Popular cities</p>

            <div className='flex items-center justify-evenly mt-3'>
             <span className='flex flex-col items-center'>
                <img src="/assets/charMinar.png" alt="CharMinar" className='w-[88%] h-[8vw]' />
                <p className='text-base text-[#6F6F6F]'>Hyderabad</p>
             </span>
             <span className='flex flex-col items-center'>
                <img src="/assets/TajMahal.png" alt="TajMahal" className='w-[88%] h-[8vw]' />
                <p className='text-base text-[#6F6F6F]'>Agra</p>
             </span>
             <span className='flex flex-col items-center'>
                <img src="/assets/IndiaGate.png" alt="IndiaGate" className='w-[88%] h-[8vw]' />
                <p className='text-base text-[#6F6F6F]'>Delhi</p>
             </span>
             <span className='flex flex-col items-center'>
                <img src="/assets/MumbaiGate.png" alt="CharMinar" className='w-[88%] h-[8vw]' />
                <p className='text-base text-[#6F6F6F]'>Mumbai</p>
             </span>
            </div>
            <p className='text-center text-base font-normal text-[#6F6F6F] mt-[0.4vw]'>View all cities</p>
            
        </div>


        <div className="nav-container  w-[95%] flex items-center justify-between p-2">
            <Link to="/dashboard"><img src="/assets/Logo.png" alt="WebLogo" className='w-[2.6vw] h-[2.6vw]' /></Link>
            <span className='container-right flex items-center justify-center gap-4'>
                <Link to="/admin" target='_blank' rel="noopener noreferrer" className='underline'>Admin Access</Link>
                <span className='flex items-center gap-2 cursor-pointer' onClick={handleClick}>
                    <p className='text-[#373737] font-normal'>New Delhi</p>
                    <img src="/assets/dropDown.png" alt="DropDown" className={`${flag?"transform rotate-180 duration-200 transition-transform":"duration-200 transition-transform"}w-[1vw] h-[0.7vw]`} />
                </span>

                <span className='flex items-center gap-1 cursor-pointer' onClick={handleProfile}>
                    <img src="/assets/user.png" alt="Profile" className='w-[2vw] h-[2vw]' />
                     <p className='text-[#373737] font-normal'>Hi,{" "}{props.title}</p>
                </span>
            </span>
        </div>
    </div>
  )

}

export default NavBar1

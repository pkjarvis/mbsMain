import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AddButton from '../components/AddButton'

import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';

const AddNewShowtime = () => {

  const [startDate,setStartDate]=useState("");

  const [datetime12h, setDateTime12h] = useState(null);
  const [datetime, setDateTime] = useState(null);


   const [selectedCities, setSelectedCities] = useState("");
      const cities = [
          { name: 'English', code: 'ENG' },
          { name: 'Hindi', code: 'HN' },
          { name: 'Marathi', code: 'MT' },
          { name: 'Telugu', code: 'TLG' },
          { name: 'Punjabi', code: 'PNJ' },
          { name: 'Spanish', code: 'SPN' },
          { name: 'French', code: 'FRN' },
          { name: 'German', code: 'GER' },
      ];


  useEffect(()=>{
    console.log(datetime);
  },[datetime])

  return (
    <div>
        <div className="showtime-container">
            <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
            <span className="flex items-center gap-2 mx-6 ">
            <a href="http://localhost:5173/dashboard"><p className="text-zinc-400 font-light text-md">Home /</p></a>
            <a href="http://localhost:5173/shows"><p className="text-zinc-400 font-light text-md">Showtime Scheduling /</p></a>
            <p className="font-light text-sm">Add New Showtime</p>
           </span>
           <div className="info flex flex-col place-items-center mt-[1.8vw]">
            <div className="flex flex-col justify-between gap-4 ">
              <p className='font-semibold text-base'>Basic Info</p>
              <input type="text" placeholder='Movie Name' required className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"/>
              <input type="text" placeholder='Theatre Name' required className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"/>

              <div className='flex items-center justify-between mb-1'>
                {/* <div className='w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>Select Date</p>
                    <img src="../src/assets/calendar.png" alt="DropDown" className='w-3 h-3' />
                </div> */}
                 <input type="date"  value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="outline-none border-1 border-zinc-300 rounded-sm p-1 text-center w-[14vw]"  />
                {/* <div className='w-[47%] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between'>
                    <p className='text-sm text-gray-500'>Select Language(s)</p>
                    <img src="../src/assets/dropDownIcon.png" alt="DropDown" className='w-3 h-2' />
                </div> */}
                 <div className="card flex justify-content-center w-[14vw] h-[2vw]">
                            <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name" display="chip" 
                                placeholder="Language(s)" maxSelectedLabels={3} className="w-full md:w-20rem"
                                pt={{
                                  root:{
                                    onFocus:"outline-none border-none",
                                    focus:"outline-none border-none"
                                  
                                  },
                                  input:{
                                    onFocus:"outline-none border-zinc-400 border-none"
                                  },
                                 
                                }}
                                />
                        </div>
                

                
              </div>


              <div className='w-[100%] h-[12vw] border-1 border-gray-300 rounded-sm p-2 flex flex-col mb-2'>
                    
                   <p className="font-semibold text-zinc-600 text-base mb-1">Add Showtime</p>
                   
                    <div className='flex items-center  gap-[4vw] mx-auto'>
                      <div className="w-[11vw]">
                      <label htmlFor="calendar-12h" className="font-bold block mb-2">
                          Starttime
                      </label>
                      <Calendar id="calendar-12h" value={datetime12h} onChange={(e) => setDateTime12h(e.value)} showTime hourFormat="12" />
                    </div>
                    <div className="w-[11vw]">
                      <label htmlFor="calendar-12h" className="font-bold block mb-2">
                          Endtime
                      </label>
                      <Calendar id="calendar-12h" value={datetime} onChange={(e) => setDateTime(e.value)} showTime hourFormat="12" />
                    </div>

                    </div>


                   <div className='btn w-[6.8vw] h-[1.4vw] border-1 border-pink-500 rounded-md flex items-center justify-center gap-2 absolute ml-[21vw] mt-[9vw] p-0.8'>
                        <img src="../src/assets/addButton.png" alt="AddIcon" className="w-[1vw] h-[1vw]"/>
                        <p className='text-xs font-semibold'>Add Showtime</p>
                   </div>

                   
              </div>
             
            
            
              <div className='buttons flex items-center justify-start gap-5 mb-1 opacity-25'>
                 <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-sm">Add</button>
                 <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-sm text-zinc-700" >Cancel</button>
                 
              </div>
            </div>
              
           </div>
        </div>
    </div>
  )
}

export default AddNewShowtime
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AddButton from '../components/AddButton'

import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { ShowTimeContext } from '../context/ShowTimeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const AddNewShowtime = () => {

  const {addShowTime,updateShowTime}=useContext(ShowTimeContext);

  const [startDate,setStartDate]=useState("");
  const [moviename,setMovieName]=useState("");
  const [theatrename,setTheatreName]=useState("");
  const [datetime12h, setDateTime12h] = useState(null);
  const [datetime, setDateTime] = useState(null);
  const [timearray,setTimeArray]=useState([]);

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


  const {state}=useLocation();
  const editingNewShowTime=state?.showtime;





  
  const navigate=useNavigate("");
  
  function formatTime(val){
     const dataObject=new Date(val);
    const hours=dataObject.getHours();
    const minutes=dataObject.getMinutes();
   
    var res,ans;
    if(hours>=12 && hours<=24){
      res="PM";
    }else {
      res="AM";
    }
    ans=`${hours}:${minutes} ${res}`;
    return ans;
  }


  



  const handleTime=()=>{
    if(!datetime || !datetime12h){
      console.log("Date time values not selected");
      return;
    }
     var val1=formatTime(datetime12h);
     var val2=formatTime(datetime);

     if(!val1 || !val2){
      console.log("Provide values for date time in time format");
      return;
     }

     console.log(val1,val2);
     setTimeArray((prev)=>[...prev,{val1,val2}]);
     setDateTime12h("");
     setDateTime("");
  }


    useEffect(()=>{
    if(editingNewShowTime){
      setMovieName(editingNewShowTime.moviename);
      setDateTime(editingNewShowTime.datetime);
      setDateTime12h(editingNewShowTime.datetime12h);
      setStartDate(editingNewShowTime.startDate);
      setTheatreName(editingNewShowTime.theatrename);
      setTimeArray(editingNewShowTime.timearray);
      setSelectedCities(editingNewShowTime.language);
    }
  },[editingNewShowTime]);

  const handleShowTimeDelete=(id)=>{
    setTimeArray(timearray.filter(t=>t.id!=timearray.id));
  }

  
  const handleSubmit=(e)=>{
    e.preventDefault();
    const newShowTime={
      id:editingNewShowTime?editingNewShowTime.id:Date.now(),
      theatrename:theatrename,
      startDate:startDate,
      moviename:moviename,
      datetime12h:datetime12h,
      datetime:datetime,
      timearray:timearray,
      language:selectedCities,
      archived:false,
    };

   
    if(editingNewShowTime){
      updateShowTime(newShowTime)
    }else{
      addShowTime(newShowTime); 
    }

    // backend call to put data to db when user clicks on add new showtime
    axiosInstance.post("/add-showtime",newShowTime,{
      withCredentials:true,
    }).then(res=>console.log(res.data))
    .catch(err=>console.log(err));

    navigate("/shows");

  };

  const handleCancel=()=>{
    setDateTime("");
    setDateTime12h("");
    setMovieName("");
    setSelectedCities("");
    setStartDate("");
    setTheatreName("");
    setTimeArray([]);
  }



  // useEffect(()=>{
  //   const dataObject=new Date(datetime12h);
  //   const hours=dataObject.getHours();
  //   const minutes=dataObject.getMinutes();
   
  //   var res;
  //   if(hours>=12 && hours<=24){
  //     res="PM";
  //   }else {
  //     res="AM";
  //   }
  //   console.log(`${hours}:${minutes} ${res}`)
    
  // },[datetime12h])

  useEffect(()=>{
    
    console.log(datetime);
  },[datetime]);




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
              <input type="text" placeholder='Movie Name' value={moviename} onChange={(e)=>setMovieName(e.target.value)} required className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"/>
              <input type="text" placeholder='Theatre Name' value={theatrename} onChange={(e)=>setTheatreName(e.target.value)} required className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"/>

              <div className='flex items-center justify-between mb-1'>
               
                 <input type="date"  value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="outline-none border-1 border-zinc-300 rounded-sm p-1 text-center w-[14vw]"  />
                
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


              <div className='w-[100%] max-w-[30vw] h-[12vw] border-1 border-gray-300 rounded-sm p-2 flex flex-col mb-2'>
                    
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
                    <div className='flex mt-2 mx-2 gap-1'>
                          {
                        timearray?.map((item,index)=>(
                          
                            <p key={index}  className='text-[0.5vw] font-light h-[0.8vw] w-auto text-zinc-800 bg-zinc-300 items-center justify-center text-center inline rounded-md'>{item.val1}-{item.val2} <span className='text-xs' onClick={()=>handleShowTimeDelete(index)}>x</span></p>
                          
                        ))
                        }
                    </div>
                       
                  

                   <div className='btn w-[6.8vw] h-[1.4vw] border-1 border-pink-500 rounded-md flex items-center justify-center gap-2 absolute ml-[21vw] mt-[9vw] p-0.8 cursor-pointer' onClick={handleTime}>
                        
                        <img src="../src/assets/addButton.png" alt="AddIcon" className="w-[1vw] h-[1vw]"/>
                        <p className='text-xs font-semibold' >Add Showtime</p>
                       
                       
                      
                        
                   </div>

                   
              </div>
             {
              startDate && moviename && theatrename && selectedCities  && timearray?.length
              ?
              <div className='buttons flex items-center justify-start gap-5 mb-1 '>
                 <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl" onClick={handleSubmit}>Add</button>
                 <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-xl text-zinc-700" onClick={handleCancel}>Cancel</button>
                 
              </div>
              :
              <div className='buttons flex items-center justify-start gap-5 mb-1 opacity-15'>
                 <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl" onClick={handleSubmit}>Add</button>
                 <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-xl text-zinc-700" onClick={handleCancel}>Cancel</button>
                 
              </div>
             }
              
            
    
            </div>
              
           </div>
        </div>
    </div>
  )
}

export default AddNewShowtime
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

// theatre-> id,theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value
// showtime -> id:Date.now(),theatrename,startDate,moviename,datetime12h,datetime,timearray,selectedCities,

const Theatres = ({ theatre,movies,timearray ,date}) => {
  const [showtime, setShowTime] = useState([]);
//   const [movies,setMovies]=useState([]);
  const navigate=useNavigate("");

  // const {state}=useLocation();
  // const movie=state?.movie;
  
  // console.log("movie from location.state",movie)
 

  // useEffect(() => {
  //   axiosInstance
  //     .get("/get-showtime", { withCredentials: true })
  //     .then((res) => {
  //       console.log(res.data);
  //       setShowTime(res.data);
  //     })
  //     .catch((err) =>
  //       console.log("Error fetching movies", err.response?.data || err.message)
  //     );
  // }, []);
//    useEffect(() => {
//     axiosInstance
//       .get("/get-showtime", { withCredentials: true })
//       .then((res) => {
//         console.log(res.data);
//         setShowTime(res.data);
//       })
//       .catch((err) =>
//         console.log("Error fetching movies", err.response?.data || err.message)
//       );
//   }, []);

  
  
  console.log("showtime", showtime);
  console.log("theatreval",theatre);

  const handleClick = (from,to) => {
    if(!date){
      alert("Please select the date first!")
      return;
    }
    navigate("/showbooking",{state:{movie:movies,theatreval:theatre,date:date,from:from,to:to}});
  };

  return (
    <div>
      <span className="flex items-center justify-start gap-4 px-2 py-2">
        <img
          src={theatre.theatrefile || "/assets/pvr.png"}
          alt={theatre.theatrename}
          className="w-[3vw] h-[3vw] rounded-full"
        />
        <span className="flex flex-col items-start">
          <p className="font-semibold text-xl">{theatre.theatrename}</p>
          <p className="text-base font-medium">{theatre.address}</p>
          <p className="text-base font-light text-[#707070]">
            Allow cancellation
          </p>
        </span>
      </span>
      <div className="h-[auto] mt-2 grid grid-cols-7 px-2 gap-4 ">
        {
        // showtime && showtime.length > 0 ? (
        //   // Inner map: Elements generated here need a key.
        //   showtime.map((shows)=>(
        //     shows.timearray?.map((item,index)=>(
        //         <div key={index} className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={()=>handleClick}>
        //             <p key={index} className="text-[#008610] " onClick={handleClick}>{item.val1}:{item.val2}</p>
        //         </div>
        //     ))
        //   )) 
        // ) 
        timearray && timearray.length>0?(
          timearray.map((item,index)=>(
           <div key={index} className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={()=>handleClick(item.val1,item.val2)}>
                <p key={index} className="text-[#008610] " >{item.val1}:{item.val2}</p>
           </div>
        ))
        )
        
        : (
        
          <p className="text-gray-500 text-xs">No times available</p>
          // Or simply: null
        )}
        {/* <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div> */}

        {/* <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                 <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                 <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                   <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                   <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                   <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                   <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div>
                   <div className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={handleClick}>
                    <p className="text-[#008610] ">2:40 PM</p>
                  </div> */}
      </div>
      <hr className="text-[#C2C2C2] mt-[1vw]" />
    </div>
  );
};

export default Theatres;
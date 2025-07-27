import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

// theatre-> id,theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value
// showtime -> id:Date.now(),theatrename,startDate,moviename,datetime12h,datetime,timearray,selectedCities,

const Theatres = ({ theatre, movies, timearray, date,showID }) => {
  const [showtime, setShowTime] = useState([]);
  //   const [movies,setMovies]=useState([]);
  const navigate = useNavigate("");

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
  const location = useLocation();

  // useEffect(()=>{
  //   if (location.state){
  //   setShowDataWarning(true);
  // }
  // },[location])

  // const d=new Date();
  // const h=d.toLocaleTimeString();

  // console.log("date now hour",h);

  console.log("showtime", showtime);
  console.log("theatreval", theatre);


  const filteredShowtimes = showtime.filter(
    (item) => item.theatre.cityName === selectedCity
  );

  console.log("Inside Theatre card",showID);

  

  const handleClick = (from, to, id, showID) => {
    if (!date) {
      // alert("Please select the date first!")
      setShowDataWarning(true);
      return;
    }
    console.log("id is", id);
    navigate("/showbooking", {
      state: {
        movie: movies,
        theatreval: theatre,
        date: date,
        from: from,
        to: to,
        id,
        showID,
      },
    });
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
        {/* {
      
        timearray && timearray.length>0?(
          timearray.map((item,index)=>(
           <div key={index} className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer" onClick={()=>handleClick(item.val1,item.val2,`${movies.id}-${theatre.id}-${date}-${item.val1}-${item.val2}`)}>
                <p key={index} className="text-[#008610] " >{item.val1}-{item.val2}</p>
           </div>
        ))
        )
        
        : (
        
          <p className="text-gray-500 text-xs">No times available</p>
          // Or simply: null
        )} */}

        {
        timearray
          .filter((item) => {
            // 1. Skip past time slots for today
            if (date === new Date().toISOString().slice(0, 10)) {
              // Construct a full datetime string
              const timeStr = `${date}T${item.val1.padStart(
                2,
                "0"
              )}:${item.val2.padStart(2, "0")}:00`;
              const slotDate = new Date(timeStr);
              return slotDate.getTime() > Date.now();
            }
            return true; // future dates — show all times
          })
          .map((item, index) => (
            <div
              key={index}
              className="font-medium border-1 border-[#ACACAC] p-2 w-[10vw] text-center rounded-2xl cursor-pointer"
              onClick={() =>
                handleClick(
                  item.val1,
                  item.val2,
                  `${movies.ID}-${theatre.ID}-${date}-${item.val1}-${item.val2}`,
                  showID,
                )
              }
            >
              <p className="text-[#008610]">
                {item.val1}-{item.val2}
              </p>
            </div>
          ))
          }

       
      </div>
      <hr className="text-[#C2C2C2] mt-[1vw]" />
    </div>
  );
};

export default Theatres;

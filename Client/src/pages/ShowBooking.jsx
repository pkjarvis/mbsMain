import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ShowBooking = () => {
  const navigate = useNavigate();
   const { state } = useLocation();
  const movie = state?.movie;
  const theatre=state?.theatreval;
  const date=state?.date;
  const from=state?.from;
  const to=state?.to;
  const showId=state?.id;
  console.log("theatre from location.state",theatre);

  console.log("Id is",showId);

  // seat booked logic
  const [soldTickets, setSoldTickets] = useState([]);
  useEffect(() => {
    if(!showId) return;
  axiosInstance.get(`/booked-seats?showId=${showId}`, { withCredentials: true })
    .then(res => {
       const paidSeats = res.data.tickets
        .flatMap((tx) => tx.tickets); // Flatten all seat arrays
      console.log("Paid Seats:", paidSeats);
      setSoldTickets(paidSeats);
    })
    .catch(err => console.error("Error fetching paid tickets:", err));
}, []);

useEffect(() => {
  soldTickets.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.setProperty("background-color", "#C0C0C0", "important");
      // el.style.pointerEvents = "none"; // Disable interaction
    }
  });
}, [soldTickets]);

  

  const username = localStorage.getItem("userName");
  useEffect(() => {
    console.log(username);
  }, [username]);

 

  

  
  const [storeId,setStoreId]=useState([]);
  const [totalprice,setTotalPrice]=useState(0);

  const handleMiddleRow = (s,id) => {
    const finalId = s + id;
    console.log(finalId);

    if (soldTickets.includes(finalId)) {
      console.warn("This seat is already sold:", finalId);
      alert(`${finalId} seat is already booked!`)
      return;
    }

    var element = document.getElementById(finalId);
    const selected=storeId.includes(finalId);

    let newStoreId=[...storeId];
    let newprice=totalprice;

    if (element) {
      if(!selected){
        newStoreId.push(finalId)
        element.style.setProperty("background-color", "#59B200","important");
        if(s==="A" || s=="B" || s==="C" || s==="D" || s==="E" || s==="F"){
          newprice+=300;
        }
        else if(s==="M"){
          newprice+=560;
        }
        else{
          newprice+=320;
        }
      }
        else{
        newStoreId=newStoreId.filter((item)=>item!==finalId);
        element.style.setProperty("background-color","#E5E5E5","important");
        if(s==="A" || s=="B" || s==="C" || s==="D" || s==="E" || s==="F"){
            newprice-=300;
        }
        else if(s==="M"){
          newprice-=560;
        }
        else{
          newprice-=320;
        }
        
        

      }
      setStoreId(newStoreId);
      setTotalPrice(newprice);
      console.log("totalprice",totalprice);
    }
    
    
    
    
  };

  console.log(totalprice)
  

  const handleSubmit = () => {
    console.log("final values of store id, totalprice",totalprice);
    console.log("final values of store id, totalprice",storeId);
    if(soldTickets.length===166){
      alert("All seats booked can't proceed to pay!")
      return;
    }
    navigate("/booking",{state:{storeId,totalprice,movie,theatre,date,from,to,showId}});
  };

  // const handlePopUP = () => {
  //   navigate("/booking",{state:{totalprice,storeId,movie}});
  // };


  return (
    <div id={showId}>
      <div className="show-booking-container">
        <div className="theatre-container font-[Inter]">
          <NavBar1 title={username} />
          <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
            <Link
              // href="http://localhost:3000/dashboard"
              to="/"
              className="cursor-pointer font-light text-zinc-500 "
            >
              Home /
            </Link>
            <Link
              // href="http://localhost:3000/movie"
              to="/movie"
              state={{ movie:movie }}
              className="cursor-pointer font-light text-zinc-500"
            >
              Movie /
            </Link>
            <Link
              // href="http://localhost:3000/showtime"
              to="/showtime"
              state={{ movie:movie }}
              className="cursor-pointer text-zinc-500"
            >
              Showtime /
            </Link>
            <Link
              to="/booking"
              state={{ movie:movie }}
              // href="http://localhost:3000/showtime"
              className="cursor-pointer"
            >
              Show Booking
            </Link>
          </span>
        </div>

        <div className="header flex justify-start mx-[3vw] mt-[2vw] gap-4 bg-[#F9F9F9] py-[1.4vw]">
          <img
            src={theatre.theatrefile || "/assets/pvr.png"}
            alt="PVR"
            className="w-[3vw] h-[3vw] rounded-full"
          />
          <span className="flex flex-col items-start justify-center">
            <h1 className="text-3xl font-bold">{movie.movie}</h1>
            <p className="font-normal text-[#5E5E5E]">
              {theatre.theatrename} | {theatre.address}| {theatre.cityName} | {theatre.stateName} | {date}
            </p>
          </span>
        </div>

        <div className="border-1 border-[#D9D9D9] mx-[3vw]">
          <div className="seat-status flex items-center justify-center gap-6  my-[0.5vw]">
            <span className="flex items-center justify-center gap-2">
              <p className="w-[1.3vw] h-[1.3vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-md"></p>
              <h3>Available</h3>
            </span>
            <span className="flex items-center justify-center gap-2">
              <p className="w-[1.3vw] h-[1.3vw] bg-[#59B200] border-1 border-[#59B200] rounded-md"></p>
              <h3>Selected</h3>
            </span>
            <span className="flex items-center justify-center gap-2">
              <p className="w-[1.3vw] h-[1.3vw] bg-[#C0C0C0] border-1 border-[#D6D6D6] rounded-md"></p>
              <h3>Sold out</h3>
            </span>
          </div>

          <div className="w-[100%] h-[auto] bg-[#F9F9F9] ">
            {/* Mth-row High tier prices*/}
            <div className="main-content mx-[3vw] p-[1vw]">
              <h3 className="text-[#949494] font-normal">Rs.560</h3>
              <hr className="my-2 text-[#D6D6D6]" />
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">M</p>
                <div id="M1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[12vw]" onClick={()=>handleMiddleRow("M",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="M2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("M",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="M3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[2vw]" onClick={()=>handleMiddleRow("M",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="M4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("M",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="M5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[2vw]" onClick={()=>handleMiddleRow("M",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="M6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("M",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="M7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[2vw]" onClick={()=>handleMiddleRow("M",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="M8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("M",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="M9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[2vw]" onClick={()=>handleMiddleRow("M",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="M10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[2vw] " onClick={()=>handleMiddleRow("M",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
              </div>
            </div>

         

            {/* Middle tier prices */}
            <div className="main-content mx-[3vw] p-[1vw]">
              <h3 className="text-[#949494] font-normal">Rs.320</h3>
              <hr className="my-1 text-[#D6D6D6]" />
              {/* Repetiton Seats */}
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
               
                <p className="text-[#949494] font-normal">L</p>
                <div style={{ backgroundColor: "#E5E5E5" }} id="L1" className="h-[2.4vw] w-[2.4vw]  border-1 border-[#D6D6D6]  rounded-sm flex items-center justify-center ml-[4vw] cursor-pointer" onClick={()=>handleMiddleRow("L",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div style={{ backgroundColor: "#E5E5E5" }} id="L2" className="h-[2.4vw] w-[2.4vw]  border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center"  onClick={()=>handleMiddleRow("L",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div style={{ backgroundColor: "#E5E5E5" }}  id="L3" className="h-[2.4vw] w-[2.4vw]  border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("L",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="L4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("L",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="L5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]" onClick={()=>handleMiddleRow("L",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="L6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("L",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="L7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("L",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="L8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("L",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="L9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("L",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="L10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("L",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="L11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("L",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
                <div id="L12" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] " onClick={()=>handleMiddleRow("L",12)}> 
                  <p className="text-center text-base  text-white">12</p>
                </div>
                <div id="L13" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("L",13)}>
                  <p className="text-center text-base  text-white">13</p>
                </div>
                <div id="L14" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("L",14)}>
                  <p className="text-center text-base  text-white">14</p>
                </div>
                <div id="L15" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("L",15)}>
                  <p className="text-center text-base  text-white">15</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">K</p>
                <div id="K1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4vw] cursor-pointer" onClick={()=>handleMiddleRow("K",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="K2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("K",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="K3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="K4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("K",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="K5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("K",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="K6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="K7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="K8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="K9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="K10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="K11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("K",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
                <div id="K12" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer " onClick={()=>handleMiddleRow("K",12)}>
                  <p className="text-center text-base  text-white">12</p>
                </div>
                <div id="K13" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer " onClick={()=>handleMiddleRow("K",13)}>
                  <p className="text-center text-base  text-white">13</p>
                </div>
                <div id="K14" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer" onClick={()=>handleMiddleRow("K",14)}>
                  <p className="text-center text-base  text-white">14</p>
                </div>
                <div id="K15" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer" onClick={()=>handleMiddleRow("K",15)}>
                  <p className="text-center text-base  text-white">15</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">J</p>
                <div id="J1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4vw] cursor-pointer" onClick={()=>handleMiddleRow("J",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="J2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("J",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="J3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="J4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="J5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("J",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="J6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="J7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="J8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="J9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="J10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="J11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("J",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
                <div id="J12" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("J",12)}>
                  <p className="text-center text-base  text-white">12</p>
                </div>
                <div id="J13" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("J",13)}>
                  <p className="text-center text-base  text-white">13</p>
                </div>
                <div id="J14" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer" onClick={()=>handleMiddleRow("J",14)}>
                  <p className="text-center text-base  text-white">14</p>
                </div>
                <div id="J15" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer" onClick={()=>handleMiddleRow("J",15)}>
                  <p className="text-center text-base  text-white">15</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">I</p>
                <div id="I1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4.3vw] cursor-pointer" onClick={()=>handleMiddleRow("I",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="I2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="I3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="I4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="I5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("I",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="I6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="I7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="I8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer" onClick={()=>handleMiddleRow("I",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="I9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="I10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="I11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("I",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
                <div id="I12" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]  cursor-pointer" onClick={()=>handleMiddleRow("I",12)}>
                  <p className="text-center text-base  text-white">12</p>
                </div>
                <div id="I13" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("I",13)}>
                  <p className="text-center text-base  text-white">13</p>
                </div>
                <div id="I14" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("I",14)}>
                  <p className="text-center text-base  text-white">14</p>
                </div>
                <div id="I15" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("I",15)}>
                  <p className="text-center text-base  text-white">15</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">H</p>
                <div id="H1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[3.8vw]" onClick={()=>handleMiddleRow("H",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="H2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center "  onClick={()=>handleMiddleRow("H",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="H3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("H",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="H4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("H",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="H5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]" onClick={()=>handleMiddleRow("H",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="H6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("H",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="H7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("H",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="H8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("H",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="H9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("H",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="H10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("H",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="H11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("H",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
                <div id="H12" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] " onClick={()=>handleMiddleRow("H",12)}>
                  <p className="text-center text-base  text-white">12</p>
                </div>
                <div id="H13" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("H",13)}>
                  <p className="text-center text-base  text-white">13</p>
                </div>
                <div id="H14" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("H",14)}>
                  <p className="text-center text-base  text-white">14</p>
                </div>
                <div id="H15" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("H",15)}>
                  <p className="text-center text-base  text-white">15</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">G</p>
                <div id="G1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[3.8vw]" onClick={()=>handleMiddleRow("G",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="G2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center "  onClick={()=>handleMiddleRow("G",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="G3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center"  onClick={()=>handleMiddleRow("G",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="G4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center "  onClick={()=>handleMiddleRow("G",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="G5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]" onClick={()=>handleMiddleRow("G",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="G6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("G",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="G7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("G",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="G8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("G",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="G9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("G",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="G10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("G",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="G11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("G",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
                <div id="G12" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] " onClick={()=>handleMiddleRow("G",12)}>
                  <p className="text-center text-base  text-white">12</p>
                </div>
                <div id="G13" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("G",13)}>
                  <p className="text-center text-base  text-white">13</p>
                </div>
                <div id="G14" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("G",14)}>
                  <p className="text-center text-base  text-white">14</p>
                </div>
                <div id="G15" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  " onClick={()=>handleMiddleRow("G",15)}>
                  <p className="text-center text-base  text-white">15</p>
                </div>
              </div>
            </div>

            {/* Low tier seat prices */}
            <div className="main-content mx-[3vw] p-[1vw] ">
              <h3 className="text-[#949494] font-normal">Rs.300</h3>
              <hr className="my-2 text-[#D6D6D6]" />
              {/* Repetiton Seats */}
              <div className="flex items-center gap-4 justify-start my-[2vw]">
                <p className="text-[#949494] font-normal">A</p>
                <div id="A1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4vw]" onClick={()=>handleMiddleRow("A",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="A2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("A",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="A3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("A",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="A4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("A",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="A5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]" onClick={()=>handleMiddleRow("A",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="A6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("A",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="A7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("A",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="A8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("A",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="A9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("A",9)}> 
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div  id="A10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("A",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="A11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("A",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">B</p>
                <div id="B1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4vw] cursor-pointer" onClick={()=>handleMiddleRow("B",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div  id="B2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("B",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="B3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="B4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("B",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="B5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("B",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="B6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="B7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="B8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="B9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="B10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="B11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("B",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">C</p>
                <div id="C1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[3.9vw] cursor-pointer" onClick={()=>handleMiddleRow("C",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="C2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer " onClick={()=>handleMiddleRow("C",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="C3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="C4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="C5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("C",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="C6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="C7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="C8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="C9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="C10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="C11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("C",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">D</p>
                <div id="D1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[3.9vw] cursor-pointer" onClick={()=>handleMiddleRow("D",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div  id="D2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div  id="D3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div  id="D4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",4)}> 
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div  id="D5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw] cursor-pointer" onClick={()=>handleMiddleRow("D",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div  id="D6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div  id="D7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div  id="D8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center  cursor-pointer" onClick={()=>handleMiddleRow("D",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div  id="D9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div  id="D10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div  id="D11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center cursor-pointer" onClick={()=>handleMiddleRow("D",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">E</p>
                <div id="E1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4vw]" onClick={()=>handleMiddleRow("E",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="E2"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center "  onClick={()=>handleMiddleRow("E",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="E3"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("E",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="E4"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("E",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="E5"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]" onClick={()=>handleMiddleRow("E",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="E6"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("E",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="E7"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("E",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="E8"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("E",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="E9"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("E",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="E10"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("E",10)}>
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="E11"  className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("E",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-start my-[1.3vw]">
                <p className="text-[#949494] font-normal">F</p>
                <div id="F1" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[4vw]" onClick={()=>handleMiddleRow("F",1)}>
                  <p className="text-center text-base  text-white">1</p>
                </div>
                <div id="F2" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center "  onClick={()=>handleMiddleRow("F",2)}>
                  <p className="text-center text-base  text-white">2</p>
                </div>
                <div id="F3" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("F",3)}>
                  <p className="text-center text-base  text-white">3</p>
                </div>
                <div id="F4" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("F",4)}>
                  <p className="text-center text-base  text-white">4</p>
                </div>
                <div id="F5" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center ml-[5vw]" onClick={()=>handleMiddleRow("F",5)}>
                  <p className="text-center text-base  text-white">5</p>
                </div>
                <div id="F6" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("F",6)}>
                  <p className="text-center text-base  text-white">6</p>
                </div>
                <div id="F7" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("F",7)}>
                  <p className="text-center text-base  text-white">7</p>
                </div>
                <div id="F8" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center " onClick={()=>handleMiddleRow("F",8)}>
                  <p className="text-center text-base  text-white">8</p>
                </div>
                <div id="F9" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("F",9)}>
                  <p className="text-center text-base  text-white">9</p>
                </div>
                <div id="F10" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("F",10)}> 
                  <p className="text-center text-base  text-white">10</p>
                </div>
                <div id="F11" className="h-[2.4vw] w-[2.4vw] bg-[#E5E5E5] border-1 border-[#D6D6D6] rounded-sm flex items-center justify-center" onClick={()=>handleMiddleRow("F",11)}>
                  <p className="text-center text-base  text-white">11</p>
                </div>
              </div>
            </div>


            
            <div className="flex flex-col items-center justify-center">
              <img
                src="/assets/rect2.png"
                alt="Overlayed image"
                className="w-[20%] h-[3vw] z-10 "
              />
              <img
                src="/assets/rect1.jpg"
                alt="Overlayed image"
                className="w-[22%] h-[2vw] mt-[-2vw]"
              />
              <p className="text-center text-md text-zinc-300">Screen</p>
            </div>
          </div>
          <div
            className="flex items-center justify-around p-[1vw] w-[100%] bg-[#F0F0F0] relative mb-4"
            // onClick={handlePopUP}
          >
            <p className="font-bold text-xl">{storeId.length} seat selected</p>
            <button
              className="bg-[#FF5295]  text-md w-[12vw] h-[2vw]  rounded-lg text-white font-semibold text-center cursor-pointer mx-[1vw]"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowBooking;
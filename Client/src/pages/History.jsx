import React, { useEffect, useState } from "react";
import NavBar1 from "../components/NavBar1";
import BookingCard from "../components/BookingCard";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
const baseUrl = import.meta.env.VITE_ROUTE;

const History = () => {
  const username = localStorage.getItem("userName");
  useEffect(() => {
    console.log(username);
  }, [username]);

  const [visible,setVisible]=useState(false); 
  const [selectedCity, setSelectedCity] = useState("");


  const handlePopup=()=>{
    setVisible(!visible);
  }
  
  const [tickets,setTickets]=useState([]);
  useEffect(()=>{
    axiosInstance.get("/get-paid-ticket",{withCredentials:true})
    .then(res=>{
      console.log("res",res.data);
      setTickets(res.data.tickets  || [])
      console.log(tickets);
    })
    .catch(err=>{
      console.log("Failed to fetch ticket",err);
    })
  },[])


  return (
    <div>
      <div className="profile-container">
        <NavBar1  title={username}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}/>
        <div className="bg-[#E2E0E0] p-2">
          <div className="flex items-center gap-[3vw] mx-[2.4vw]">
            <Link to="/profile">Profile</Link>
            <Link to="/history">History</Link>
          </div>
        </div>
        <div className="mx-[3vw] h-[6vw] w-[94%] mt-[1vw]">
          <h1 className="font-semibold text-xl my-1">Booked movies</h1>

          {/* <BookingCard onClick={()=>handlePopup} val={visible} func={setVisible} /> */}
          {
            tickets.length>0?(
              tickets.map((ticket,index)=>(
                <BookingCard
                  key={index}
                  val={visible}
                  func={setVisible}
                  onClick={handlePopup}
                  ticketData={ticket}
                />
              ))
            ):(
              <p className="text-gray-500">No booked tickets</p>
            )
          }


          
          {/* <h1 className="font-semibold text-xl my-3">Past Movies</h1> */}

          {/* <BookingCard onClick={()=>handlePopup} val={visible} func={setVisible} />
          <BookingCard onClick={()=>handlePopup} val={visible} func={setVisible} />
          <BookingCard onClick={()=>handlePopup} val={visible} func={setVisible} />
          <BookingCard onClick={()=>handlePopup} val={visible} func={setVisible} /> */}
        </div>

      </div>
        {/* <Footer/> */}
    </div>
  );
};

export default History;
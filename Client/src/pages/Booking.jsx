import React, { useEffect } from "react";
import NavBar1 from "../components/NavBar1";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Booking = () => {
  const username = localStorage.getItem("userName");
  useEffect(() => {
    console.log(username);
  }, [username]);

  const { state } = useLocation();
  console.log("state", state);
  const store = state?.storeId;
  const price = state?.totalprice;
  const movie = state?.movie;
  const theatreval=state?.theatre;

  console.log("seats", store);
  console.log("totalprice", price);

  const movieId = movie.id;



  const submitToPayU = (payUData) => {

    const { payuFormFields, actionURL } = payUData;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = actionURL;

    for (const key in payuFormFields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = payuFormFields[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

  };



  const handlePayment = async () => {
    if(price===60) return;
    try{
      const res = await axiosInstance.post(
      "/api-payu",
      { store, price, movieId },
      { withCredentials: true }
    );
      const  payUData  = res.data?.payUData;
      console.log("Api response",res.data);

      if(!payUData || !payUData.payuFormFields || !payUData.actionURL){
        console.error("Invalid PayuData",payUData);
        return;
      }

      submitToPayU(payUData);

    }catch(error){
      console.error("Payment Api failed",error);
    }
    
  };

  return (
    <div>
      <div className="booking-container">
        <NavBar1 title={username} />
        <span className="flex items-center justify-start mx-[3vw] gap-1 mt-2">
          <Link
            to="/dashboard"
            className="cursor-pointer font-light text-zinc-500 "
          >
            Home /
          </Link>
          <Link
            to="/movie"
            state={{movie:movie}}
            className="cursor-pointer font-light text-zinc-500"
          >
            Movie /
          </Link>
          <Link
            to="/showtime"
            state={{movie:movie}}
            className="cursor-pointer text-zinc-500"
          >
            Showtime /
          </Link>
          <Link to="/showtime" className="cursor-pointer" state={{storeId:store,totalprice:price,movie:movie}}>
            Show Booking
          </Link>
        </span>

        <div className="h-[auto] bg-[rgba(248, 248, 248, 0.55)] mx-[20vw] mt-[2vw] shadow-2xl p-[2.4vw] flex flex-col rounded-xl ">
          <span className="flex gap-2 items-center justify-start">
            <img
              src={theatreval.theatrefile  || "/assets/pvr.png"}
              alt="PVR"
              className="w-[5%] h-[3vw] rounded-full"
            />
            <span>
              <h1 className="text-2xl font-bold">{movie.movie}</h1>
              <p className="text-base font-normal text-[#5E5E5E]">
               {theatreval.theatrename} | {theatreval.address} | {theatreval.cityName} | {theatreval.stateName}
              </p>
            </span>
          </span>
          <span className="border-1 border-[#A7A7A7] rounded-2xl p-2 mt-[1.2vw]">
            <h1 className="my-1 text-sm ml-1">Monday,May 26,2025, 07:05 PM</h1>
            <hr className="1px solid text-[#A7A7A7] my-1 w-[98%] mx-[0.4vw]" />
            <span>
              <h1 className="text-sm ml-1 my-1">{store.length} Tickets</h1>
              <h1 className="text-[#9F9F9F] text-sm ml-1">
                {store.map((item, index) => (
                  <p key={index} className="inline-flex">
                    {item}
                    {index < store.length - 1 && ", "}
                  </p>
                ))}
              </h1>
            </span>
          </span>
          <h1 className="text-xl mt-[1vw] font-semibold">Payment Summary</h1>
          <span className="border-1 border-[#A7A7A7] rounded-2xl p-3 mt-[1.2vw]">
            <span className="flex items-center justify-between">
              <p className="text-sm font-light text-[#626262]">Order Amount</p>
              <p className="text-sm font-light text-[#626262]">Rs.{price}</p>
            </span>
            <span className="flex items-center justify-between">
              <p className="text-sm font-light text-[#626262]">
                Booking Charge
              </p>
              <p className="text-sm font-light text-[#626262]">Rs.50</p>
            </span>
            <span className="flex items-center justify-between">
              <p className="text-sm font-light text-[#626262]">CGST</p>
              <p className="text-sm font-light text-[#626262]">Rs.5</p>
            </span>
            <span className="flex items-center justify-between">
              <p className="text-sm font-light text-[#626262]">SGST</p>
              <p className="text-sm font-light text-[#626262]">Rs.5</p>
            </span>
            <hr className="1px solid text-[#A7A7A7] my-1 w-[99%] mx-[0.1vw]" />
            <span className="flex  items-center justify-between">
              <p>Total Amount</p>
              <p>Rs.{price + 50 + 5 + 5}</p>
            </span>
          </span>
          <h1 className="text-xl mt-[1vw] font-semibold">Your details</h1>
          <span className="border-1 border-[#A7A7A7] rounded-2xl p-3 mt-[1.2vw] flex items-center  justify-between">
            <span className="flex flex-col">
              <p className="text-[#626262]">+91-93234234293</p>
              <p className="text-[#626262]">Delhi-NCR</p>
            </span>
            <img
              src="/assets/Pencil.png"
              alt="Pencil"
              className="w-[1.5vw] h-[1.5vw]"
            />
          </span>
          <span className="border-1 border-[#A7A7A7] rounded-2xl p-3 mt-[1.2vw] flex items-center gap-[0.6vw]">
            <img
              src="/assets/Question.png"
              alt="QuestionMark"
              className="w-[1vw] h-[1vw]"
            />
            <p className="text-sm">Terms and Conditions</p>
          </span>
          <span
            className="bg-[#FF5295] rounded-2xl p-3 mt-[1.2vw] flex items-center justify-between cursor-pointer"
            onClick={handlePayment}
          >
            <span>
              <p className="text-white text-md">Rs.{price + 50 + 5 + 5}</p>
              <p className="text-white text-sm">Total</p>
            </span>
            <p className="text-white text-md">Proceed to Pay</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Booking;
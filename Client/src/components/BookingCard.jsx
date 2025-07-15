import React, { useState } from "react";
import Barcode from "react-barcode";

const BookingCard = (props) => {

   const [visible, setVisible] = useState(false);

  const handlePopup = () => setVisible(true);
  const handleCancel = () => setVisible(false);


  console.log(props.ticketData);
  const {amount,tickets,transactionId,ID,date,from,to,movieName,theatreName,theatreAddress,movieFile}=props.ticketData || {};
  console.log("amount",theatreName);
  

  return (
    <>
      <div className="card-container h-[90%] flex items-center border-1 border-[#E0DFDF] rounded-md overflow-hidden gap-1 my-2">
        {/* Popup */}
        {visible && (
          <>
            <div className="fixed inset-0 bg-black opacity-45 z-30"></div>
            <div className="absolute  w-[50%] h-[18vw] left-[26vw] top-[10vw] bg-white shadow-2xl z-50  flex items-center justify-evenly">
              <div className="w-[30%] h-[15vw] mt-[2vw] ">
                <Barcode
                  // value="12ljsdowiewljwe"
                  value={transactionId}
                  format={"CODE128"}
                  height={45}
                  width={1}
                  className="transform rotate-270 ml-[-6vw] my-[4.2vw]"
                />
              </div>
              <p className="text-2xl font-bold absolute top-5 left-220 cursor-pointer" onClick={handleCancel}>X</p>
              <div className="w-[30%] h-[14vw] flex flex-col ml-[-12vw] mt-4">
                <p className="bg-[#FF5295] p-2 text-white font-medium text-center">
                  Cinema Ticket
                </p>
                <span className="flex items-center justify-between mt-2 ">
                  <p className="text-[#848386] text-md">THEATRE:{theatreName}</p>
                </span>
                <span className="flex items-center justify-between  ">
                  <p className="text-[#848386] text-md">Seats:{tickets?.join(", ")}</p>
                </span>
                <span className="flex items-center justify-between">
                  <p className="text-[#848386] text-md">DATE:</p>
                  <p className="text-[#848386] text-md">{date}</p>
                </span>
                <span className="flex items-center justify-between">
                  <p className="text-[#848386] text-md">PRICE</p>
                  <p className="text-[#848386] text-md">Rs.{amount}</p>
                </span>
                <span className="flex flex-col items-start justify-center gap-2 mt-2">
                  <p className="text-xl text-[#FF5295]">{movieName}</p>
                  <p className="text-[#848386] text-md">NO.{ID}</p>
                </span>

              </div>
              <hr className="  border-1 border-dashed h-[14vw] border-[#6E6B6E] transform rotate-180 ml-3" />
              <div className="flex flex-col items-center justify-evenly">
                <p className="text-sm font-medium text-[#848386]">STANDARD</p>
                <p className="text-sm font-medium text-[#848386]">3D</p>
                <div className="w-[auto]  mt-[0.2vw] ">
                  <Barcode
                    value={transactionId }
                    format={"CODE128"}
                    height={30}
                    width={1}
                    className="transform rotate-360 "
                  />
                </div>

                <p className="text-sm font-medium text-[#848386]">DATE: TIME</p>
                <p className="text-sm font-medium text-[#848386]">{date}</p>
                <p className="text-sm font-medium text-[#848386]">{from}-{to}</p>
              </div>
            </div>
          </>
        )}
    
        <div className="left w-[6%] h-[100%] ">
          <img
            src={movieFile}
            alt="Inception"
            className="w-[100%] h-[100%]"
          />
        </div>
        <div className="right flex items-center justify-between w-[92%] p-1">
          <div className="rights-left flex flex-col py-1 justify-evenly gap-1">
            <h1 className="text-xs">Booked For:</h1>
            <p className="text-sm font-semibold">{movieName}</p>
            <p className="text-xs text-[#3B3B3B]">
              {theatreAddress}
            </p>
            {/* <p className="text-[#5E5B5B] font-light text-xs">@ 2 Hours ago</p> */}
          </div>
          <span
            className="w-[9%] h-[2vw] bg-[#FF5295] text-white flex rounded-sm items-center justify-center cursor-pointer"
            onClick={handlePopup}
          >
            <p className="text-white text-md text-center flex items-center justify-center">
              View Ticket
            </p>
          </span>
        </div>
      </div>
    </>
  );
};

export default BookingCard;
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteBox from "./DeleteBox";
import { ShowTimeContext } from "../context/ShowTimeContext";

const ShowTimeCard = ({
  id,
  theatrename,
  startDate,
  moviename,
  datetime12h,
  datetime,
  timearray,
  language,
  archived,
  file,
 
}) => {
  const [visible, setVisible] = useState(false);
  const pencilIconRef = useRef(null);
  const deleteIconRef = useRef(null);
  const [check, setCheck] = useState(false);
  // const [archive,setArchive]=useState(false);
  const { showtimes } = useContext(ShowTimeContext);
  const thisShow = showtimes.find((s) => s.id === id);

  const handleClick = () => {
    setVisible(!visible);
  };

   const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // returns YYYY-MM-DD
  };

  const navigate = useNavigate("");
  const handleUpdate = () => {

    const date=formatDate(startDate);
    navigate("/admin-addnewshows", {
      state: {
        showtime: {
          id,
          theatrename,
          startDate:date,
          moviename,
          datetime12h,
          datetime,
          timearray,
          language,
        },
      },
    });
  };

  const handleArchive = (id) => {
    setCheck(!check);
    setVisible(!visible);
  };

  return (
    <div >
      {/* Add archive condition here */}
      <div
        className={
          archived
            ? "card-container h-22 w-[100%] mx-auto p-6 mb-7 opacity-55"
            : "card-container h-22 w-[100%] mx-auto p-6 mb-7 "
        }
      >
        <div className="content flex items-center justify-start border-1 rounded-xl border-zinc-300 ">
          <div className="left w-[6.2%]">
            <img
              src={file || "/assets/Inception.png"}  
              alt="MovieBg"
              className="w-26 h-25 rounded-l-md"
            />
          </div>
          <div className="right flex items-center justify-between w-[92%] my-1">
            <div className="right-left flex flex-col">
              <span className="flex items-center gap-2">
                <p className="font-semibold text-xl leading-0.2">{moviename}</p>
                <span className="text-xs font-light border-1 rounded-xl p-1 border-[#E7E6EA]">
                  <p className="p-0.6">Show Added:{timearray.length}</p>
                </span>
              </span>
              <span className="flex gap-1">
                <p className="text-xs font-semibold text-[#373737]">
                  {theatrename}{" "}
                </p>
              </span>
              <span className="flex gap-2 my-1">
               
                {timearray?.map((item, index) => (
                  <p
                    key={index}
                    className="w-auto h-auto bg-[#E6E9E6] text-[0.7vw] border-1 border-zinc-300 rounded-xl text-center items-center px-1 flex place-items-center font-light text-black"
                  >
                    {item.val1}-{item.val2}
                  </p>
                ))}
              </span>
              <span className="flex gap-1">
                {language.name && (
                  <p className="text-xs font-light text-zinc-700">
                    {language.name}
                  </p>
                )}
              </span>
              {check ? (
                <DeleteBox
                  name={theatrename}
                  id={id}
                  val={check}
                  func={setCheck}
                  type="blur"
                  status="Archive"
                  className="z-10"
                />
              ) : null}
            </div>
            <div className="right-right">
              {archived ? (
                <img
                  src="/assets/3Dot.png"
                  alt="3Dot"
                  className="w-1.2 h-4  opacity-10"
                />
              ) : (
                <img
                  src="/assets/3Dot.png"
                  alt="3Dot"
                  className="w-1.2 h-4 cursor-pointer"
                  onClick={handleClick}
                />
              )}

              {visible ? (
                <div className="hidden-card w-[8.5vw] h-[5vw]  bg-white py-2 mt-[-2vw] px-4 rounded-xl gap-3  absolute right-[4vw] shadow-[0_4px_4px_0px_rgb(0,0,0,0.45)] border-1 border-gray-200">
                  <span
                    className="flex place-items-center gap-4 my-2 items-center hover:bg-zinc-700 rounded-sm p-0.6 hover:[&>.para]:text-white cursor-pointer"
                    onMouseOver={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src = "/assets/Pencil.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src = "/assets/DarkPencil.png";
                      }
                    }}
                    onClick={handleUpdate}
                  >
                    <img
                      src="/assets/DarkPencil.png"
                      alt="PencilIcon"
                      className="w-[0.9vw] h-[0.9vw] pencil"
                      ref={pencilIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 hover:text-white para">
                      Update
                    </p>
                  </span>

                  <span
                    className="flex place-items-center gap-4 my-1 items-centerm hover:bg-zinc-700 rounded-sm p-0.6 text-white hover:[&>.para]:text-white cursor-pointer"
                    onMouseOver={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src = "/assets/ArchiveLight.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src = "/assets/ArchiveDark.png";
                      }
                    }}
                    onClick={() => handleArchive(id)}
                  >
                    <img
                      src="/assets/DeleteDarkIcon.png"
                      alt="DeleteIcon"
                      className="w-[0.9vw] h-[0.9vw]"
                      ref={deleteIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 para ">
                      Archive
                    </p>
                  </span>
                </div>
              ) : (
                <div className="hidden-card w-[8.5vw] h-[5vw]  bg-white py-2 mt-[-2vw] px-4 rounded-xl gap-3  absolute right-[4vw] shadow-[0_4px_4px_0px_rgb(0,0,0,0.45)] border-1 border-gray-200 hidden">
                  <span
                    className="flex place-items-center gap-4 my-2 items-center hover:bg-zinc-700 rounded-sm p-0.6 hover:[&>.para]:text-white cursor-pointer"
                    onMouseOver={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src = "/assets/Pencil.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src = "/assets/DarkPencil.png";
                      }
                    }}
                    onClick={handleUpdate}
                  >
                    <img
                      src="/assets/DarkPencil.png"
                      alt="PencilIcon"
                      className="w-[0.9vw] h-[0.9vw] pencil"
                      ref={pencilIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 hover:text-white para">
                      Edit
                    </p>
                  </span>

                  <span
                    className="flex place-items-center gap-4 my-1 items-centerm hover:bg-zinc-700 rounded-sm p-0.6 text-white hover:[&>.para]:text-white cursor-pointer"
                    onMouseOver={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src = "/assets/DeleteIcon.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src =
                          "/assets/DeleteDarkIcon.png";
                      }
                    }}
                    onClick={() => handleArchive(id)}
                  >
                    <img
                      src="/assets/DeleteDarkIcon.png"
                      alt="DeleteIcon"
                      className="w-[0.9vw] h-[0.9vw]"
                      ref={deleteIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 para ">
                      Delete
                    </p>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTimeCard;

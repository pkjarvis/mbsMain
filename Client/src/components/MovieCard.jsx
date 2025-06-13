import React, { useContext, useRef, useState } from "react";
import { MoviesContext } from "../context/MovieContext";
import { useNavigate } from "react-router-dom";
import DeleteBox from "./DeleteBox";
import axiosInstance from "../utils/axiosInstance";

const MovieCard = ({id,movie,description,startDate,endDate,genre,language,status,file}) => {
  const navigate = useNavigate("");

  const [visible, setVisible] = useState(false);
  const pencilIconRef = useRef(null);
  const deleteIconRef = useRef(null);

  const [check,setCheck]=useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };

  const { movies,deleteMovie,updateMovie } = useContext(MoviesContext);
  
  const handleDelete = (id) => {

    setCheck(!check);
    setVisible(!visible);

    // delete movie api call would go here
    axiosInstance.post("/delete-movie",id,{
      withCredentials:true
    }).then(res=>console.log(res.data))
    .catch(err=>console.log(err))
   
  }

  const handleUpdate=()=>{
    navigate("/addnewmovie",{state:{movie:{id,movie,description,startDate,endDate,genre,language,status,file}}});
  }







  return (
    <div>
      <div className="card-container h-22 w-[100%] mx-auto p-6 mb-6">
        <div className="content flex items-center justify-start border-1 rounded-xl border-zinc-300 ">
          <div className="left w-[6.2%]">
            <img
              src={file}
              alt="MovieBg"
              className="w-23 h-23 rounded-l-md"
            />
          </div>
          <div className="right flex items-center justify-between w-[92%] my-1">
            <div className="right-left flex flex-col">
              <span className="stream-tag flex items-center">
                {
                  status==="nowShowing"
                  ?(
                  <p className="bg-green-300 rounded-xl  p-1 text-xs">
                  {status}
                  </p>)
                  :(
                  status==="expired"
                  ?(
                  <p className="bg-orange-300 rounded-xl  p-1 text-xs">
                  {status}
                  </p>)
                  :(
                    <p className="bg-blue-400 rounded-xl  p-1 text-xs">
                     {status}
                    </p>
                  )
                   )
                }
               
                <p className="rounded-xl border-1 border-zinc-200 p-1 text-xs">
                  Show Added
                </p>
              </span>
              <p className="font-semibold">{movie}</p>
              <span className="tags flex gap-2">
                {language?.map((lang,index)=>(
                  <p key={index} className="font-thin text-xs border-0.4 rounded-md bg-zinc-300 w-auto p-0.7 text-center">{lang.name}</p>
                ))}
              </span>
              <p className="font-light text-sm">{genre}</p>
            </div>
            {
                check?<DeleteBox name={movie} id={id} val={check} func={setCheck} type="movie" status="Delete"/>:null
              }
            <div className="right-right">
              <img
                src="../src/assets/3Dot.png"
                alt="3Dot"
                className="w-1.2 h-4"
                onClick={handleClick}
              />
              {visible ? (
                <div className="hidden-card w-[8.5vw] h-[5vw]  bg-white py-2 mt-[-2vw] px-4 rounded-xl gap-3  absolute right-[4vw] shadow-[0_4px_4px_0px_rgb(0,0,0,0.45)] border-1 border-gray-200">
                  <span
                    className="flex place-items-center gap-4 my-2 items-center cursor-pointer hover:bg-zinc-700 rounded-sm p-0.6 hover:[&>.para]:text-white"
                    onMouseOver={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src = "../src/assets/Pencil.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src =
                          "../src/assets/DarkPencil.png";
                      }
                    }}
                    onClick={handleUpdate}
                  >
                    <img
                      src="../src/assets/DarkPencil.png"
                      alt="PencilIcon"
                      className="w-[0.9vw] h-[0.9vw] pencil"
                      ref={pencilIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 hover:text-white para">
                      Edit
                    </p>
                  </span>

                  <span
                    className="flex place-items-center gap-4 my-1 items-center cursor-pointer hover:bg-zinc-700 rounded-sm p-0.6 text-white hover:[&>.para]:text-white"
                    onMouseOver={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src =
                          "../src/assets/DeleteIcon.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src =
                          "../src/assets/DeleteDarkIcon.png";
                      }
                    }}
                    onClick={()=>handleDelete(id)}
                  >
                    <img
                      src="../src/assets/DeleteDarkIcon.png"
                      alt="DeleteIcon"
                      className="w-[0.9vw] h-[0.9vw]"
                      ref={deleteIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 para ">
                      Delete
                    </p>
                  </span>
                </div>
              ) : (
                <div className="hidden-card w-[8.5vw] h-[5vw]  bg-white py-2 mt-[-2vw] px-4 rounded-xl gap-3  absolute right-[4vw] shadow-[0_4px_4px_0px_rgb(0,0,0,0.45)] border-1 border-gray-200 hidden">
                  <span
                    className="flex place-items-center gap-4 my-2 items-center cursor-pointer hover:bg-zinc-700 rounded-sm p-0.6 hover:[&>.para]:text-white"
                    onMouseOver={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src = "../src/assets/Pencil.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (pencilIconRef.current) {
                        pencilIconRef.current.src =
                          "../src/assets/DarkPencil.png";
                      }
                    }}
                    onClick={handleUpdate}
                  >
                    <img
                      src="../src/assets/DarkPencil.png"
                      alt="PencilIcon"
                      className="w-[0.9vw] h-[0.9vw] pencil"
                      ref={pencilIconRef}
                    />
                    <p className="text-md font-medium text-zinc-500 hover:text-white para">
                      Edit
                    </p>
                  </span>

                  <span
                    className="flex place-items-center gap-4 my-1 items-center cursor-pointer hover:bg-zinc-700 rounded-sm p-0.6 text-white hover:[&>.para]:text-white"
                    onMouseOver={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src =
                          "../src/assets/DeleteIcon.png";
                      }
                    }}
                    onMouseLeave={() => {
                      if (deleteIconRef.current) {
                        deleteIconRef.current.src =
                          "../src/assets/DeleteDarkIcon.png";
                      }
                    }}
                    onClick={()=>handleDelete(id)}
                  >
                    <img
                      src="../src/assets/DeleteDarkIcon.png"
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

export default MovieCard;

import React, { useContext } from "react";
import { TheatreContext } from "../context/TheatreContext";
import { MoviesContext } from "../context/MovieContext";
import { ShowTimeContext } from "../context/ShowTimeContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";


const DeleteBox = (props) => {
  const { deleteTheatre } = useContext(TheatreContext);
  const { deleteMovie ,fetchMovies} = useContext(MoviesContext);
  const { archive } = useContext(ShowTimeContext);

  const navigate=useNavigate("");

  const handleDelete = async(id) => {
    if (props.type === "theatre") {
      // delete call
      axiosInstance
      .post("/delete-theatre", id, {
        withCredentials: true,
      })
      .then((res) => console.log(res.data)) 
      .catch((err) => console.log(err));

      deleteTheatre(id);
      toast("Theatre has been deleted successfully!")
    }
    if (props.type === "movie") {
      deleteMovie(id);
      props.func(!props.val)
       // delete movie api call would go here
          axiosInstance.post("/delete-movie",id,{
            withCredentials:true
          }).then(res=>{
            console.log(res.data)
            
          })
          .catch(err=>console.log(err))


      

      
    }
    if (props.type === "blur") {
      props.func(!props.val);
      archive(id);
       axiosInstance.post("/archive-showtime",id,{
      withCredentials:true
      })
      .then(res=>console.log(res.data))
      .catch(err=>console.log(err))

      toast("Archived successfully!");
      

    }
    
   
  
      
   
   setTimeout(()=>{
     window.location.reload();
   },1000)

    if(props.type==="movie"){
    toast("Movie Deleted Successfully!")
   }

   

  
    
  };

  const handleCancel = () => {
    props.func(!props.val);
  };
  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-2xl rounded-xl mx-auto gap-1 p-3 w-[16vw] fixed top-[20rem] left-[45rem]">
      <p className="text-xl text-pink-600 font-bold">{props.status} ?</p>
      <p className="text-md font-medium text-center">
        Are you sure you want to delete this{" "}
        <span className="font-bold font-md flex-wrap">
          Theatre:{props.name} ?
        </span>
      </p>
      <span className="flex items-center gap-3 mt-1">
        <button
          className="text-black border-1 border-pink-500 rounded-xl p-2 w-[6vw] cursor-pointer"
          onClick={() => handleCancel()}
        >
          Cancel
        </button>
        <button
          className="text-white bg-pink-500 rounded-xl p-2 w-[6vw] cursor-pointer"
          onClick={() => handleDelete(props.id)}
        >
          {props.status}
        </button>
      </span>
    </div>
  );
};

export default DeleteBox;

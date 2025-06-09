import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MainHeader from "../components/MainHeader";
import AddButton from "../components/AddButton";


// import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { MoviesContext } from "../context/MovieContext";
import { useNavigate } from "react-router-dom";

const AddNewMovie = () => {
  const [movie, setMovie] = useState("");
  const [description,setDescription]=useState("")
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [genre,setGenre]=useState("");
   const [language,setLanguage]=useState("");
   const [status,setStatus]=useState("");
   const [file,setFile]=useState("");
   
   const fileInputRef=useRef(null);

   const handleDivClick=()=>{
    fileInputRef.current.click();
   };


   const handleFileChange=async(e)=>{
    e.preventDefault();
    const val=e.target.files[0];
    if(val){
      console.log("file",val);
      let bg=document.getElementById("ImageBg");
      let imageUrl=val?URL.createObjectURL(val):"";
      setFile(imageUrl);
      bg.style.background=`url(${imageUrl})`;
      bg.style.backgroundSize="cover";
      bg.style.objectFit="fill";
      
    }
    
   }

   const handleCancel=()=>{
    setMovie("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setGenre("");
    setLanguage("");
    setStatus("");
    setFile(null);
    let bg=document.getElementById("ImageBg");
    bg.style.background="";

   }

   const navigate=useNavigate()

   

   const {addMovie,editMovie,setEditMovie} = useContext(MoviesContext);

   const [formData,setFormData]=useState({
    id:null,
    movie:'',
    description:'',
    genre:'',
    language:'',
    file:null,
    startDate:'',
    endDate:'',
    status:''
   });

   useEffect(()=>{
    if(editMovie){
      setEditMovie(editMovie.movie);
      setDescription(editMovie.description);
      setGenre(editMovie.genre);
      setLanguage(editMovie.language);
      setStatus(editMovie.status);
      setStartDate(editMovie.startDate);
      setEndDate(editMovie.endDate);
      setFile(editMovie.file);
    }
  },[editMovie])

   const handleSubmit = (e)=>{
    e.preventDefault();
    // selected file need to be converted into url such that it could be passed as src props
    // const imageURL=file?URL.createObjectURL(file):"";

    const newmovie={
      id:editMovie?editMovie.id:Date.now(),
      movie:movie,
      description:description,
      language:language,
      genre:genre,
      status:status,
      startDate:startDate,
      endDate:endDate,
      file:file
    }

    if(editMovie){
      updateMovie(newmovie);
      setEditMovie(null);
    }

    addMovie(newmovie)
    console.log("movies content",newmovie)
    navigate("/movie")

   }


   


  return (
    <div>
      <div className="add-movie flex flex-col">
        <Navbar para="Find showtimes by Movie, Theatre, Date, etc." />
        <span className="flex items-center gap-2 mx-6 ">
          <a href="http://localhost:5173/dashboard">
            <p className="text-zinc-400 font-light text-md">Home /</p>
          </a>
          <a href="http://localhost:5173/movie">
            <p className="text-zinc-400 font-light text-md">
              Movie Management /
            </p>
          </a>
          <p className="font-light text-sm">Add New Movie</p>
        </span>
        <div className="info flex flex-col place-items-center mt-[1.8vw]">
          <div className="flex flex-col justify-between gap-2">
            <p className="font-semibold text-base">Basic Info</p>
            <input
              type="text"
              placeholder="Movie Title"
              required
              value={movie}
              className="w-[30vw] h-[2vw] className='text-sm text-gray-500' border-1 border-gray-300 p-2 rounded-sm mb-1 outline-none"
              onChange={(e) => setMovie(e.target.value)}
            />
            <textarea
              type="text"
              placeholder="Movie Description"
              required
              value={description}
              className="w-[30vw] h-[8vw]  border-1 border-gray-300 p-2  rounded-sm mb-1 outline-none "
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center justify-between mb-1">
             
                <select   id="genre" placeholder="Genre" value={genre} onChange={(e)=>setGenre(e.target.value)} className="w-[14vw] h-[2vw] border-1 border-gray-300 rounded-sm p-1 flex items-center justify-between outline-none">
                  <option id="default" value="Genre">Genre</option>
                  <option id="thriller" value="thriller">Thriller</option>
                  <option id="adventure" value="adventure">Adventure</option>
                  <option id="comedy" value="comedy">Comedy</option>
                  <option id="horror" value="horror">Horror</option>
                </select>
               
         
               <select id="language" value={language} onChange={(e)=>setLanguage(e.target.value)} className="w-[14vw] h-[2vw]  border-1 border-gray-300 rounded-sm p-1 flex items-center justify-between outline-none">
                  <option  id="default" value="Language(s)">Language(s)</option>
                  <option id="english" value="english" className="outline-none">English</option>
                  <option id="hindi" value="hindi">Hindi</option>
                  <option id="marathi" value="marathi">Marathi</option>
                  <option id="telugu" value="telugu">Telugu</option>
                </select>
            </div>  

            <div className="flex items-center justify-start gap-9 mb-1">
            

              <input type="date"  value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="outline-none border-1 border-zinc-300 rounded-sm p-1 text-center w-[14vw]"  />
              <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="outline-none border-1 border-zinc-300 rounded-sm p-1 text-center w-[14vw]"  />
  

            
            </div>

            {/* <div className="w-[30vw] border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between mb-1">
              {/* <p className="text-sm text-gray-500">Status</p>
              <img
                src="../src/assets/dropDownIcon.png"
                alt="DropDown"
                className="w-3 h-2"
              /> }
              
            </div> */}

             <select id="language" value={status} onChange={(e)=>setStatus(e.target.value)} className="w-[100%] h-[2vw]  border-1 border-gray-300 rounded-sm p-2 flex items-center justify-between outline-none">
                  <option id="english" value="nowShowing" className="outline-none">Now Showing</option>
                  <option id="hindi" value="showAdded">Show Added</option>
                
            </select>

            <p className="font-semibold text-zinc-600 text-base my-2">
              Upload Poster
            </p>
            
            <div id="ImageBg" className="w-[6vw] h-[6vw] flex flex-col items-center justify-center gap-4 border-1 border-dashed border-zinc-400 rounded-sm px-auto mb-1 bg-[url(file)]" onClick={handleDivClick}  >
              {
                file
                ?
                 <div>
                  <img src="../src/assets/Upload.png" alt="Upload.png"  className="w-[1.4vw] h-[1.4vw] hidden mx-auto" />  
                  <p className=" text-gray-500 text-xs mx-auto hidden">Upload file here</p>

                 </div>
              :
                <div>
                  <img src="../src/assets/Upload.png" alt="Upload.png"  className="w-[1.4vw] h-[1.4vw] mx-auto" />  
                  <p className=" text-gray-500 text-xs mx-auto mt-2">Upload file here</p>

                </div>
              }
             
              {/* <img src="../src/assets/Upload.png" alt="Upload.png"  className="w-[1.4vw] h-[1.4vw]" />  
              <p className=" text-gray-500 text-sm mx-auto hidden">Upload file here</p> */}
              <input type="file"   className=" text-gray-500 text-sm mx-auto hidden"  ref={fileInputRef} onChange={handleFileChange}  />
            </div>
            {
              movie && description && startDate && endDate && genre && language && status && file
              ?
              <div className="buttons flex items-center justify-start gap-5 mb-1">
              <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl"
                onClick={handleSubmit}
              >
                Add
              </button>
              <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-xl text-zinc-700" onClick={handleCancel}>
                Cancel
              </button>
            </div>
            :
            <div className="buttons flex items-center justify-start gap-5 mb-1 opacity-25">
              <button className="bg-pink-500 cursor-pointer w-[6vw] h-[2vw] text-md text-white font-semibold p-1 rounded-xl"
               onClick={handleSubmit}
              >
                Add
              </button>
              <button className="bg-white cursor-pointer w-[6vw] h-[2vw] text-md border-1 border-zinc-400 font-semibold p-1 rounded-xl text-zinc-700" onClick={handleCancel}>
                Cancel
              </button>
            </div>
            }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewMovie;

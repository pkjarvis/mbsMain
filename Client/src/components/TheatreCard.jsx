import React,{useContext, useEffect, useRef,useState} from "react";
import { TheatreContext } from "../context/TheatreContext";
import DeleteBox from "./DeleteBox";
import { useNavigate } from "react-router-dom";


const TheatreCard = ({id,theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value}) => {

  const [visible,setVisible]=useState(false);
    const pencilIconRef=useRef(null);
    const deleteIconRef=useRef(null);
    const [check,setCheck]=useState(false);

    const navigate=useNavigate("");

    useEffect(()=>{
      status="Active"
    },[])
  
    const handleClick=()=>{
        setVisible(!visible);
    };
    // const {deleteTheatre}=useContext(TheatreContext);

    const handleDelete=(id)=>{
      // if(status.toLowerCase()==="active"){
      //   alert("Can't delete active theatre");
      //   setVisible(!visible);
      //   return;
      // }
      setCheck(!check);
      setVisible(!visible);
     
    };

    const handleUpdate=()=>{
      navigate("/admin-addnewtheatre",{state:{theatre:{id,theatrename,address,cityName,stateName,status,totalscreens,theatrefile,value}}})
    }

    
    status="Active";
   

  return (
    <div>
      <div className="card-container h-25 w-[100%]  px-6 pt-7  mb-2">
        <div className="content flex items-center justify-start border-1 rounded-xl border-zinc-300  h-[4.8vw]">
          <div className="left w-[4%] ml-2">
            <img
              src={theatrefile}
              alt="MovieBg"
              className="w-15 h-15 rounded-full"
            />
          </div>
          <div className="right flex items-center justify-between w-[94%] ">
            <div className="right-left flex flex-col   gap-0.2">
              <span className="stream-tag flex items-center gap-2">
                <p className=" text-2xl font-semibold text-[#373737]">{theatrename}</p>
                {
                status==="Active"
                ?
                <p className="rounded-xl border-1 border-zinc-200 p-1 text-xs bg-green-200">
                  {status}
                </p>:(
                 
                  <p className="rounded-xl border-1 border-zinc-200 p-1 text-xs bg-yellow-200">
                  {status}
                </p>
                )
                
                }
                {/* <p className="rounded-xl border-1 border-zinc-200 p-1 text-xs bg-green-200">
                  {status}
                </p> */}
                <p className="rounded-xl border-1 border-zinc-200 p-1 text-xs">
                  Total Screen :{totalscreens}
                </p>
              </span>

              <span className="flex items-center gap-2">
                <img src="/assets/Locate.png" alt="LocateIcon" className="w-[0.8vw] h-[0.9vw]" />
                <p className="font-normal text-[#373737] text-md">{cityName}, {stateName}</p>
              </span>

              <span className="tags flex gap-2 ">
                {
                 value?.map((item,index)=>(
                      <p key={index} className="font-sm text-[0.6vw] border-0.4 rounded-md bg-zinc-300 w-auto p-0.5 text-center">
                        {item}
                      </p>
                    )
                  )
                }
              </span> 
              {
                check?<DeleteBox name={theatrename} id={id} val={check} func={setCheck} type="theatre" status="Delete"/>:null
              }
            </div>
            <div className="right-right left-4 cursor-pointer">
              <img
                src="/assets/3Dot.png"
                alt="3Dot"
                className="w-1 h-4"
                onClick={()=>handleClick(id)}
              />

              {
              visible
              ?
              <div className="hidden-card w-[8.5vw] h-[5vw]  bg-white py-2 mt-[-2vw] px-4 rounded-xl gap-3  absolute right-[4vw] shadow-[0_4px_4px_0px_rgb(0,0,0,0.45)] border-1 border-gray-200">
                 
                  <span className="flex place-items-center gap-4 my-2 items-center hover:bg-zinc-700 rounded-sm p-0.6 hover:[&>.para]:text-white" 
                   onMouseOver={()=>{
                    if(pencilIconRef.current){
                      pencilIconRef.current.src="/assets/Pencil.png"
                    }
                   }}
                   onMouseLeave={()=>{
                    if(pencilIconRef.current){
                      pencilIconRef.current.src="/assets/DarkPencil.png"
                    }
                   }}
                   onClick={handleUpdate}
                  >
                    <img src="/assets/DarkPencil.png" alt="PencilIcon" className="w-[0.9vw] h-[0.9vw] pencil" ref={pencilIconRef} />
                    <p className='text-md font-medium text-zinc-500 hover:text-white para' >Edit</p>
                  </span>



                   <span className='flex place-items-center gap-4 my-1 items-centerm hover:bg-zinc-700 rounded-sm p-0.6 text-white hover:[&>.para]:text-white' 
                    onMouseOver={()=>{
                      if(deleteIconRef.current){
                        deleteIconRef.current.src="/assets/DeleteIcon.png"
                      }
                    }}
                     onMouseLeave={()=>{
                      if(deleteIconRef.current){
                        deleteIconRef.current.src="/assets/DeleteDarkIcon.png"
                      }
                    }}
                    onClick={()=>handleDelete(id)}
                   >
                    <img src="/assets/DeleteDarkIcon.png" alt="DeleteIcon" className="w-[0.9vw] h-[0.9vw]" ref={deleteIconRef} />
                    <p className='text-md font-medium text-zinc-500 para '>Delete</p>
                  </span>

              </div>
              :
              <div className="hidden-card w-[8.5vw] h-[5vw]  bg-white py-2 mt-[-2vw] px-4 rounded-xl gap-3  absolute right-[4vw] shadow-[0_4px_4px_0px_rgb(0,0,0,0.45)] border-1 border-gray-200 hidden" >
                 
                  <span className="flex place-items-center gap-4 my-2 items-center hover:bg-zinc-700 rounded-sm p-0.6 hover:[&>.para]:text-white" 
                   onMouseOver={()=>{
                    if(pencilIconRef.current){
                      pencilIconRef.current.src="/assets/Pencil.png"
                    }
                   }}
                   onMouseLeave={()=>{
                    if(pencilIconRef.current){
                      pencilIconRef.current.src="/assets/DarkPencil.png"
                    }
                   }}
                   onClick={handleUpdate}
                  >
                    <img src="/assets/DarkPencil.png" alt="PencilIcon" className="w-[0.9vw] h-[0.9vw] pencil" ref={pencilIconRef} />
                    <p className='text-md font-medium text-zinc-500 hover:text-white para' >Edit</p>
                  </span>



                   <span className='flex place-items-center gap-4 my-1 items-centerm hover:bg-zinc-700 rounded-sm p-0.6 text-white hover:[&>.para]:text-white' 
                    onMouseOver={()=>{
                      if(deleteIconRef.current){
                        deleteIconRef.current.src="/assets/DeleteIcon.png"
                      }
                    }}
                     onMouseLeave={()=>{
                      if(deleteIconRef.current){
                        deleteIconRef.current.src="/assets/DeleteDarkIcon.png"
                      }
                    }}
                    onClick={()=>handleDelete(id)}
                   >
                    <img src="/assets/DeleteDarkIcon.png" alt="DeleteIcon" className="w-[0.9vw] h-[0.9vw]" ref={deleteIconRef} />
                    <p className='text-md font-medium text-zinc-500 para '>Delete</p>
                  </span>


              </div>
              }
              
              


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheatreCard;

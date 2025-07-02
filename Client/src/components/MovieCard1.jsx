import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

// movie-> {id,movie,description,startDate,endDate,genre,language,status,file}
// "../src/assets/aliceWonderland.png"
const MovieCard1 = ({movie}) => {
    if(!movie || !movie.file) return null;
 
  const navigate=useNavigate("");
    useEffect(() => {
      window.scrollTo(0,0);
      
    }, []);

  const handleClick=()=>{
    navigate("/movie",{state:{movie}});
  }

  return (
    <div className='  hover:scale-109 ease-in-out duration-300 '>
        <div className="card-img-container w-[100%] h-[auto] mt-[1.8vw] border-1 border-zinc-400 rounded-2xl overflow-hidden  cursor-pointer" onClick={handleClick}>
            {/* <a href="http://localhost:3000/movie"> */}
              <img src={movie.file} alt={movie.movie} className='w-[100%] h-[23vw]'  />
            {/* </a> */}
            <span className='w-[95%] mt-2' >
                <p className='text-md text-black font-semibold mx-2'>{movie.movie || "Alice Wonderland"}</p>
                 <span className='flex items-center justify-start gap-2 ml-3'>
                    <p className='text-gray-400'>4.2</p>
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star14.png" alt="Star14" className='w-[1.16vw] h-[1.18vw]' />
                </span>
                <p className='text-[#6F6F6F] font-light mx-2 flex-wrap'>{movie.genre} | UA13+ | {movie.language?.map((lang,index)=>(
                  <p key={index} className='inline-block flex-wrap'>{lang.name}{index<movie.language.length-1 && ", "}</p>
                ))}</p>
            </span>
        </div>
    </div>
  )
}

export default MovieCard1
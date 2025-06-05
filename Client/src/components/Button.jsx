import React from 'react'

const Button = (props) => {
  return (
    <div className="button-container cursor-pointer h-[1.8vw] w-[8vw] bg-pink-500  flex items-center  p-3 text-base text-white font-[Inter] font-semibold rounded-xl justify-center">
        {
        props.title=="Go to Movies"
        ?<a href="http://localhost:5173/movie">{props.title}</a>
        :props.title=="Manage Theatres"
        ?<a href="http://localhost:5173/theatre">{props.title}</a>
        :<a href="http://localhost:5173/shows">{props.title}</a>
        }
        
    </div>
  )
}

export default Button
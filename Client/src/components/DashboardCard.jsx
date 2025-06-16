import React from 'react'
import Button from './Button'

const DashboardCard = (props) => {



  return (
    <div className="cards-container font-[Inter] my-8 ">
        <div className="content w-[18vw] h-[20vw] border-1 border-zinc-300 rounded-xl py-4 flex flex-col items-center justify-evenly z-5 hover:bg-pink-100  ease-in-out duration-300">
            <img src={props.icon} alt="CardImage" className="w-[62%] h-[52%]" />
            <h2 className="text-xl font-semibold">{props.title}</h2>
            <p className="text-wrap mx-[2vw] text-center   items-center flex justify-center p-1 mb-0.2" >{props.desc}</p>
            <Button title={props.buttonTitle}  />
        </div>
    </div>
  )
}

export default DashboardCard
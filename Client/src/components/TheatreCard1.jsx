import React from 'react'

const TheatreCard1 = () => {
  return (
    <div className='w-[30%] mt-[2vw]'>
        <div className="card-container w-[100%] h-[32vw]">
            <div className='w-[100%%] h-[26vw] rounded-xl overflow-hidden'>
                <img src="/assets/Chaava.png" alt="Chaava"  className='scale-122 w-[100%] h-[109%] ease-in-out hover:scale-100 hover:w-[100%] hover:h-[100%] hover:ease-in-out duration-300' />
            </div>
            <div className='flex flex-col mt-4'>
                <p className='text-md text-black font-semibold'>Alice in Wonderland</p>
                <span className='flex items-center justify-start gap-2'>
                    <p className='text-gray-400'>4.2</p>
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star.png" alt="Star" className='w-[1vw] h-[1vw]' />
                    <img src="/assets/Star14.png" alt="Star14" className='w-[1.16vw] h-[1.18vw]' />
                </span>
                <p className='text-[#6F6F6F] font-light '>Adventure|UA13+|English,Hindi</p>
                <button className='bg-[#FF5295] w-[7vw] h-[2vw] text-white font-medium rounded-lg  mt-2'>Book Now</button>
            </div>
        </div>
    </div>
  )
}

export default TheatreCard1
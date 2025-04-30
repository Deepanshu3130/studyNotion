import React from 'react'
// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

function CourseCard({heading , description , level , lessonNumber}) {
  return (
    <div   className={`w-[360px] lg:w-[30%] bg-richblack-800 text-richblack-25 h-[300px] box-border cursor-pointer`}>
      
       <div className="border-b-[2px]  h-[80%] p-6 flex flex-col gap-3">
        <h1> {heading}</h1>
        <p className="text-richblack-400  border-richblack-400 border-dashed"> {description}=</p>

        <div  className={`flex justify-between  text-richblack-300
         px-6 py-3 font-medium`}>
           {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{lessonNumber} Lession</p>
        </div>
        </div>
       </div>

    </div>
  )
}

export default CourseCard
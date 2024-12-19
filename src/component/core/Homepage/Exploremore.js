import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from "./HighlightText"
import CourseCard from './CourseCard';

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];






function Exploremore() {

 let [currentTab , setCurrentTab] = useState(tabsName[0])
let[Courses , setCourses] = useState(HomePageExplore[0].courses) ;


const setMyCards= (value)=>{
  console.log("click has been triggered");
  
  setCurrentTab(value);
  console.log(currentTab);
  
  const result = HomePageExplore.filter((courses)=>{
    return courses.tag === value
  })
  setCourses(result[0].courses)
};
  return (
    <div>
      <div className='flex flex-col'>
        <p className="text-4xl font-semibold text-center my-3"> Unlock the <HighlightText text={"power of Code"}></HighlightText></p>
        <p className="text-center text-richblack-300 text-lg font-semibold ">
        Learn to Build Anything You Can Imagine</p>
      </div>

  {/* Tabs Section */}
      <div className='flex flex-row mt-3 bg-richblack-800 rounded-full text-[16px] px-7 py-[7px] gap-4' >
        {tabsName.map((element, index) => {
          return (
            <div
              className={` text-[16px] flex flex-row items-center gap-2 ${
                currentTab === element
                  ?"bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } px-7 py-[7px] rounded-full transition-all duration-300 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {Courses.map((course , index)=>{
          return(
            <CourseCard 
              heading ={course.heading}
              description ={course.description}
              level ={course.level}
              lessonNumber={course.lessionNumber}
              key={index}></CourseCard>
          )
        })
        
        
        }
      </div>


    </div>
  )
}

export default Exploremore
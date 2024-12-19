import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import {FaChevronLeft} from 'react-icons/fa'
import {MdOutlineKeyboardArrowDown} from 'react-icons/md'
import {FaAngleDoubleRight} from 'react-icons/fa'
import { useState } from 'react';


function VideoDetailsSidebar({setReviewModal}) {
    const {courseSectionData, courseEntireData, completedLectures, totalNoOfLectures} = useSelector(state => state.viewCourse);
    const {courseId,sectionId,subsectionId} = useParams();
    const [activeStatus, setActiveStatus] = useState("");
    const navigate = useNavigate()
    const [videoActive, setVideoActive] = useState("");
    // useEffect(()=>{
    //     function setActive(){
    //         if(!courseSectionData) return;
    //         const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
    //         const currentSubSectionIndex= courseSectionData[currentSectionIndex].subSection.findIndex((subSection) => subSection?._id === subsectionId);
    //         if(currentSectionIndex === -1 || currentSubSectionIndex === -1) return;

    //         const activesubsectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex]._id;
    //         setActiveStatus(courseSectionData[currentSectionIndex]._id);
    //         setVideoActive(activesubsectionId);
    //     }
    //     setActive()

    // } , [courseSectionData, sectionId, subsectionId])
  return (
    <div>

      <div>
        <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90'>
        <FaChevronLeft className=' cursor-pointer hidden md:block' onClick={()=>{
                navigate(`/dashboard/enrolled-courses`);
              }}/>
        <button>
            review
        </button>
        </div>
        <div className='flex flex-col'>
            <p>My Courses</p>
            <p className='text-sm font-semibold text-richblack-500'>
              {completedLectures?.length} of {totalNoOfLectures} Lectures Completed
            </p>
        </div>

      </div>

      <div className='h-[calc(100vh - 5rem)] overflow-y-auto px-2'>
        {
            courseSectionData.map((section , index) =>(
                <details key={index} className=' appearance-none text-richblack-5 detailanimatation'>
                    
                <summary className='mt-2 cursor-pointer text-sm text-richblack-5 appearance-none'>
                  <div className='flex flex-row justify-between bg-richblack-600 px-5 py-4'>
                    <p className='w-[70%] font-semibold'>{section?.sectionName}</p>
                    <div className='flex items-center gap-3'>
                      <MdOutlineKeyboardArrowDown className='arrow'/>
                    </div>
                  </div>
                </summary>

                {
                    section.subSection.map((subSection , index)=> (
                        <div  key={subSection?._id} className='transition-[height] duration-500 ease-in-out'>
                      <div onClick={()=>{
                        //setShowSidebar(true);
                        navigate(`/dashboard/enrolled-courses/view-course/${courseId}/section/${section?._id}/sub-section/${subSection?._id}`);
                      }} className={`${subSection?._id === videoActive? ("bg-yellow-200"):("bg-richblack-50") } cursor-pointer items-baseline  flex gap-3  px-5 py-2 font-semibold text-richblack-800 relative border-b-[1px] border-richblack-600 `}>
                      {/* <input type='checkbox' className=' '/> */}
                      <div className="checkbox-wrapper-19 absolute bottom-1">
                        <input readOnly={true} checked={
                          completedLectures?.includes(subSection?._id)
                        }  type="checkbox" />
                        <label className="check-box">
                        </label>
                        </div>
                      <p className=' ml-6'>{subSection?.title}</p>
                      </div>
                    </div>
                    ))
                }
                    
                </details>
            ))
        }

       </div>

    </div>
  )
}

export default VideoDetailsSidebar
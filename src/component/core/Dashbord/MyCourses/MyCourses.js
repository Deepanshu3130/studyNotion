import React, { useEffect, useState } from 'react'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsApi'
import { useSelector } from 'react-redux'
import  {useNavigate} from "react-router-dom"
import CoursesTable from './CoursesTable'

function MyCourses() {
    const{token} = useSelector((state)=> state.auth);
    console.log(token)
    const [courses , setCourses] = useState(null);
    const navigate = useNavigate()

    async function FetchMyCourses(){
        try{
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result)
            }

        }catch(error){
            console.log("could fetch your courses")

        }
       }

    useEffect(()=>{
    //    async function FetchMyCourses(){
    //     try{
    //         const result = await fetchInstructorCourses(token);
    //         if(result){
    //             setCourses(result)
    //         }

    //     }catch(error){
    //         console.log("could fetch your courses")

    //     }
    //    }
       FetchMyCourses()
    },[])
  return (
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <div className='mb-14 flex items-center justify-between'>
            <p className='text-3xl font-medium text-richblack-5' > MY courses </p>
            <button className="flex items-center bg-yellow-50
                cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900"
            onClick={()=>navigate("/dashboard/add-course")}>
               <p>Add Course</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-richblack-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
            </button>
        </div>
      {console.log("in course", courses)}
        <div> 
        {courses && <CoursesTable courses={courses} setCourses={setCourses}></CoursesTable>}
        </div>
    </div>
  )
}

export default MyCourses
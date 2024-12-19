import React, { useEffect , useState } from 'react'
import { Outlet } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsApi'
import { useDispatch , useSelector } from 'react-redux'
import {setCompletedLectures, setCourseSectionData, setEntireCourseData } from '../slices/viewCourseSlice';
import { useParams } from 'react-router';
import { setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from "../component/core/viewcourse/VideoDetailsSidebar"


function ViewCourse() {
   
    const [reviewModal, setReviewModal] = useState(false)
    const {courseId} = useParams();
    const {token} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    useEffect(()=>{
        const setCourseSpecifics = async() => {
            const courseData = await getFullDetailsOfCourse(courseId , token);
            console.log("course data is" , courseData)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completedVideos));
            var lecture = 0
            courseData?.courseDetails?.courseContent?.forEach((section)=>{
                lecture += section?.subsection?.length
            });
            dispatch(setTotalNoOfLectures(lecture));
        }
        setCourseSpecifics();

    } , [courseId, token, dispatch])
  return (
    <div className=' flex w-screen'>
    <div className=''>
    <VideoDetailsSidebar setReviewModal={setReviewModal} />
    </div>
    <div>
        <Outlet/>
    </div>
    {
        //reviewModal && <ReviewModal setReviewModal={setReviewModal} />
    }
</div>
)
}
export default ViewCourse
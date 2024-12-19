import React from 'react'
import { useForm } from 'react-hook-form'
import {useState, useEffect} from "react"
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { setLoading } from '../../../../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createSection, updateSection  } from "../../../../../services/operations/courseDetailsApi"
import { setCourse, setEditCourse } from '../../../../../slices/courseSlice';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import NestedView from "./NestedView"
import { setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';



function SectionBuilder() {
    const {
        register,
        handleSubmit,
        formState:{errors},
        getValues,
        setValue
    }=useForm();
    // go next bhi pending ha
    const [editSectionName , setEditSectionName] = useState(false);
    const dispatch = useDispatch()
    const [loading , setLoading] = useState(false);
    const {token} = useSelector((state)=> state.auth);
    const {course} = useSelector((state)=>state.course);

    function gonext(){
       if (course.courseContent.length > 0){
        if (
            course.courseContent.some((section) => section.subSection.length > 0)
          ){
            dispatch(setStep(3))

        }else{
            toast.error("Please add atleast one lesson to esch section");

        }
       }else{
        toast.error("Please add atleast one section to continue");
       }
    }
    // next wala function is also pending
    async function onSubmit(data){
        // write edit section logic
        setLoading(true)
        let result = null;
         if(editSectionName) {
            result =updateSection({
                sectionName:data.sectionName,
                courseId:course._id,
                sectionId: editSectionName,
            })
         }
         else{
            result =await createSection({
                sectionName: data.sectionName,
                courseId: course._id,    
            },token);
         }
         console.log("test result is ",result)


         if(result){
            dispatch(setCourse(result));
            console.log(course)
            setValue("sectionName", "");
            setEditSectionName(false)
            // ek condition aur aaegi abhi yaha kuch edit wali see that 
            // editsection name false karne ki need ha?

            }
           setLoading(false)

    }

    const handelChangeEditSectionName =(sectionId , sectionName)=> {
        if (editSectionName===sectionId) {
            setEditSectionName(false);
            setValue("sectionName", "");
            return;
        }

        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
        

    };
    useEffect(() => {
        console.log("useeffct course is" ,course); // This will log the updated value of 'course' after it changes.
      }, [course]); // Listen to changes in `course`
  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6" >
       
      
         <p className="text-2xl font-semibold text-richblack-5"> Course Builder</p>
       
        <form onSubmit ={handleSubmit(onSubmit)} className="space-y-4">
            
                <label className="text-sm text-richblack-5" htmlFor="sectionName">
                    Section Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                id='sectionName'
                type="text"
                name="sectionName" 
                 className="form-style w-full"
                placeholder="Add a Section to build your course"
                {...register("sectionName", {required: true})}

                ></input>
                {errors.sectionName && (
                    <p> this field is requied</p>
                ) }
            

            <div className="flex items-end gap-x-4">
                <button type="submit"
                 className="flex text-yellow-50 items-center border border-yellow-50 bg-transparent cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold undefined">
                  {editSectionName ? ("Edit Section"):("Create Section")}
                  <AiOutlinePlusCircle size={20} className="text-yellow-50" />
                </button>

                {editSectionName && (
                   <button
                    onClick={() => {
                   setEditSectionName(false);
                   setValue("sectionName", "");
                     }}
                   type="button"
                   className="text-sm text-richblack-300 underline"
                    >
                    Cancel Edit
                 </button>
                   )}
            </div>
        </form>

        {
            course.courseContent.length>0 && <NestedView handelChangeEditSectionName={handelChangeEditSectionName}></NestedView>
        }
         <div div className="flex justify-end gap-x-3">
            <button
            onClick={() => {
                dispatch(setEditCourse(true));
                dispatch(setStep(1));
            }}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
            >
            Back
            </button>
            <button onClick={gonext}
            className='flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined'>

              <span className="false">Next</span>
             <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
            </button>
            {/* abhi ek button pending ha ... */}

         </div>
       
    </div>
  )
}

export default SectionBuilder
import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { createSubSection } from '../../../../../services/operations/courseDetailsApi';
import { setCourse } from '../../../../../slices/courseSlice';
import {useState, useEffect} from "react"
import toast from 'react-hot-toast';
import { updateSubSection } from '../../../../../services/operations/courseDetailsApi';
import Upload from './Upload';
import { RxCross1 } from 'react-icons/rx';
 function SubsectionModal({
    modalData,
    setModalData,
    add = false,
    edit = false,
    view =false,
}) {

  console.log(modalData)

  const {token} = useSelector((state)=>state.auth);
    //console.log(token)
    const {course}= useSelector((state)=> state.course);


  useEffect (() => {
    if (view || edit) {
        setValue("title", modalData.title);
        setValue("lectureDescription", modalData.description);
        setValue("lectureVideo", modalData.videoUrl);
        // console.log("useeffect modalData", modalData);
    }
},[view,edit]);

    const{
        register,
        handleSubmit,
        formState :{errors},
        getValues,
        setValue,

    }= useForm();

   


    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.lecture !== modalData.title ||
             currentValues.lectureDesc !== modalData.description ||
              currentValues.lectureVideo !== modalData.videoUrl) {
            return true;
        }
        return false;
    }


    const handelEditSubsection = async (data) => {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("SubsectionId", modalData._id);
        if (currentValues.lecture !== modalData.title) {
            formData.append("title", data.title);
        }
        if (currentValues.lectureDesc !== modalData.description) {
            formData.append("description", data.lectureDesc);
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
        formData.append("videoFile", data.lectureVideo);
        }

        formData.append("courseId", course._id);
        // console.log("formdata", [...formData]);
        const result = await updateSubSection(formData, token);
        if (result) {
            dispatch(setCourse(result));
        }
        setModalData(null);
    }
    const dispatch = useDispatch();

    async function onSubmit(data)
    {
        if(view){
            return;
        }
        if(edit) {
            if (!isFormUpdated()) {
                toast.error("No changes made");
            }
            else {
                handelEditSubsection(data);

               }
               return;

            }

        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title" , data.title)
        formData.append("description" , data.lectureDescription)
        formData.append("videoFile" , data.lectureVideo)
        formData.append("courseId" , course._id);

        const result = await createSubSection(formData, token);
        if (result) {
            dispatch(setCourse(result))
        };
        setModalData(null)


    }

  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
    <div className='my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800'>
        <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
       <p className='text-xl font-semibold text-richblack-5'>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
         <button onClick={()=> setModalData(null)}> {/*cross mai error aai to dek lena isko ek baar */}
        <RxCross1 size={20} color={"white"} />
        </button>
       </div>
      
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
         { console.log(modalData.videoUrl)}
         <Upload
                    name="lectureVideo"
                    label="lectureVideo"
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    video={true}
                    viewData={view ? modalData.videoUrl: null}
                    editData={edit ? modalData.videoUrl: null}></Upload>  {/*//isko dekhna samjna revice karna then remove the comment and deploye*/}

        <div className='flex flex-col space-y-2'>
          
          <label className='text-sm text-richblack-5' htmlFor='lecture' > Lecture title</label>
          <input
          id='lecture'
         disable ={view}
          type ="text"
          palceholder="Enter lecture title"
          {...register("title", {required:true})}
          className='form-style w-full'
        >
          

          </input>
          {errors.lectureTitle && (
            <span > please enter the lecture title</span>
          )}

        </div>

        <div className='flex flex-col space-y-2'>
          
          <label className='text-sm text-richblack-5'>Lecture Description</label>
          <textarea
          disable ={view}
          id="lectureDesc"
          palceholder="Enter lecture description"
          {...register("lectureDescription", {required:true})}>

          </textarea>
          {errors.lectureDescription && (
            <span > please enter the lecture Description</span>
          )}

        </div>

        {
            !view && 
            <button className="flex items-center bg-yellow-50
                cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900" 
                type = "submit">
                {edit ? "save changes" : "save"}
            </button>
        }

        </form>
      </div>

    </div>
  )
}

export default SubsectionModal
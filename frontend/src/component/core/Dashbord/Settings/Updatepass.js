import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import {changePassword} from "../../../../services/operations/SettingApi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
function Updatepass() {
    const { token } = useSelector((state) => state.auth)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
    const navigate = useNavigate()

    const [showOldPassword, setShowOldPassword] = useState();
    const [showNewPassword, setShowNewPassword] = useState();
    const submitHandler= async (data) => {
         console.log("password Data - ", data)
        try {
          await changePassword( token , data)
        } catch (error) {
          console.log("ERROR MESSAGE - ", error.message)
        }
      }
    
  return (
    <div>
      
      <form onSubmit={handleSubmit(submitHandler)}>
        <div  className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <h2  className="text-lg font-semibold text-richblack-5"> password</h2>
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="relative flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor='oldPassword'  className="lable-style">current Password </label>
                    <input
                    name='oldPassword'
                    id='oldPassword'
                    className='form-style'
                    type={showOldPassword ? "text" : "password"} 
                    {...register("oldPassword", {require :true})}></input>
                    <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[55px] z-[10] cursor-pointer">
                    {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
                </span>
                {errors.oldPassword && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
                )}

                </div>
                <div className="relative flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor='newPassword' className="lable-style">New Password</label>
                    <input
                    name='newPassword'
                    id='newPassword'
                    className='form-style'
                    type={showNewPassword ? "text" : "password"} 
                    {...register("newPassword", {require :true})}></input>
                    <span
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-[55px] z-[10] cursor-pointer">
                    {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                  ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                  )}
                  </span>
                  {errors.newPassword && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your Current Password.
                  </span>
                  )}
               </div>


            </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>

          <button className={`flex items-center bg-yellow-50
                 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 $`}
          type='submit'>Update</button>
        </div>
      </form>
    </div>
  )
}

export default Updatepass
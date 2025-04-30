import { useState } from "react"

import { useSelector } from "react-redux"

import { updatePfp } from "../../../../services/operations/SettingApi"


export default function ChangeProfilePicture() {
  const pfp=useSelector(state=>state.profile.user.image);
  const [profilePicture, setprofilePicture] = useState(pfp)
  const token= useSelector(state=>state.auth.token);


  const handleUpload = (e) => {
    console.log("upload button is clicked")
    e.preventDefault();
    const file = e.target[0].files[0];
    console.log(file)
    updatePfp(token,file);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setprofilePicture(URL.createObjectURL(file));
  }


  return (
    <>
        <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 md:p-8 md:px-12 px-3 py-3 text-richblack-5'>
          <div className='flex items-center gap-x-4'>
            <img className='aspect-square w-[78px] rounded-full object-cover'  src={profilePicture}></img>
            <div className='space-y-2'>
            <p>Change Profile Picture</p>
            <form onSubmit={handleUpload}>
            <div className='flex flex-row gap-3'>
              <label className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'" htmlFor="upload">Select
            <input id='upload' type="file" onChange={handleFileChange} className="hidden" accept="image/png, image/gif, image/jpeg"/></label>
             <button type='submit' className='flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 
             undefined'>Upload..</button>
            </div>
            </form>
            </div>
          </div>
        </div>
        
    </>
  )
}
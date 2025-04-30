import React, { useState , useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../services/operations/authApi';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"

function ProfileDropDown() {
    const { user } = useSelector((state) => state.profile) 
    const [open , setOpen] = useState(false);
    const dispatch= useDispatch();
    const navigate = useNavigate();
    const ref = useRef();
    useOnClickOutside(ref, ()=>setOpen(false) )

  // flow -->
  //     make a button and make the state variavble to handle click on this button 
  //     inside button comes whole pp and dashboard and logout button
  //     use on outside click handler and  ref 
  return (
    <div>
       
       <button className="relative" onClick={()=> setOpen(true)}>
         <div  className="flex items-center gap-x-1">
            <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[30px] rounded-full object-cover">
            </img>
            <AiOutlineCaretDown className="text-sm text-richblack-100" />
            
         </div>
         
          {
            open &&
            <div  onClick={(e) => e.stopPropagation()} //look into this why this is applied 
                className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
                ref={ref}>
              <Link 
              onClick={() => setOpen(false)}
              to={"/dashboard/my-profile"}>
               <div  className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100
                hover:bg-richblack-700 hover:text-richblack-25">
                  <VscDashboard className="text-lg" />
                 Dashboard
               </div>

              </Link>

              <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100
               hover:bg-richblack-700 hover:text-richblack-25"
                onClick={() => {
                dispatch(logout(navigate))
                setOpen(false)
                 }}>
                <VscSignOut className="text-lg" />
               logout

              </div>
            </div>
          }


       </button>
      
    </div>
  )
}

export default ProfileDropDown
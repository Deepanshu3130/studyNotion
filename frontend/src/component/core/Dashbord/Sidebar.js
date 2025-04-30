import React, { useState, } from 'react'
import { useSelector , useDispatch } from 'react-redux'
import { sidebarLinks } from "../../../data/dashboard-links"
import SidebarLinks from './SidebarsLinks'
import { logout } from '../../../services/operations/authApi'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'
import { VscSignOut } from 'react-icons/vsc'
function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading: profileLoading } = useSelector(
        (state) => state.profile
      )
      const { loading: authLoading } = useSelector((state) => state.auth)
      const[modalData, SetModalData] = useState(null)

    if (profileLoading || authLoading) {
        return (
          <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px]
           border-r-richblack-700 bg-richblack-800">
            <div className="spinner"></div>
          </div>
        )
      }
    
  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px]
           border-r-richblack-700 bg-richblack-800 py-10">
        <div className="flex flex-col">
            {
                sidebarLinks.map((link)=>{
                  if (link.type && user.accountType !== link.type) return null
                  return(
                    <SidebarLinks key={link.id} link={link} iconName={link.icon}
                    />
                  )
                })
            }
        </div>
        <div >
          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
            <div className="flex flex-col">
            <SidebarLinks
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
            </div>

              <button className="px-8 py-2 text-sm font-medium text-richblack-300"
               onClick={()=>
                 SetModalData({
                text1 : "Are you sure?",
                text2 : "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                button1:  () => dispatch(logout(navigate)),
                button2: () =>  SetModalData(null), // if error comes look into this

            }
                
            )}>
                <div className="flex items-center gap-x-2">
                    <VscSignOut className="text-lg" />
                    <span > Logout</span>
                </div>
            </button>
        </div>
        {modalData && <ConfirmationModal modalData={modalData}></ConfirmationModal>}
    </div>
  )
}

export default Sidebar
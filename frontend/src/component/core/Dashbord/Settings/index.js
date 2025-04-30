import React from 'react'
import ChangeProfilePicture from "./ChangeProfilePicture"
import EditProfile from './EditProfile'
import DeleteAccount from './DeleteAccount'
import Updatepass from './Updatepass'

function Settings() {
  return (
    <div className="mb-14 text-3xl font-medium text-richblack-5">
        <h1> Edit Profile</h1>

       <ChangeProfilePicture></ChangeProfilePicture>
        <EditProfile/>
        <Updatepass/>
        <DeleteAccount/>
    </div>
  )
}

export default Settings
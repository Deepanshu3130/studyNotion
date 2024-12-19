import { settingsEndpoints } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../apiConnector";
import {toast} from "react-hot-toast"
import { setUser } from "../../slices/profileSlice";
import {logout} from "./authApi"
const{
    UPDATE_PROFILE_API,
    DELETE_PROFILE_API,
    UPDATE_DISPLAY_PICTURE_API,
    CHANGE_PASSWORD_API,

} = settingsEndpoints;


export function updateProfile(token, formdata ){
  console.log(token, formdata)
    return async (dispatch) =>{
        const toastId = toast.loading("loading...")
        try{
          const response = await apiConnector("PUT", UPDATE_PROFILE_API, {formdata, token}, {
            Authorization: `Bearer ${token}`,
          })
             console.log("UPDATE_PROFILE_API API RESPONSE............", response)

         if (!response.data.success) {
              throw new Error(response.data.message)
            }
          const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
        
        dispatch(
            setUser({ ...response.data.updatedUserDetails, image: userImage })
          )
          toast.success("Profile Updated Successfully")



        }catch(error){
            console.log(error)
            toast.error(error)  // test all toast after all the work is done

        }
        toast.dismiss(toastId)

    }

}

export function deleteAccount( token , navigate){
    return async(dispatch) =>{
         const toastId = toast.loading( "Loading")
         try{
          const response = await apiConnector("DELETE", DELETE_PROFILE_API, {token}, {
            Authorization: `Bearer ${token}`,
          })
            console.log("DELETE_PROFILE_API API RESPONSE............", response)

                if (!response.data.success) {
                    throw new Error(response.data.message);}

                    toast.success("Profile Deleted Successfully")
                 dispatch(logout(navigate))

      

         }catch(error){
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
    }
}

export async function updatePfp(token, pfp) {
  const toastId = toast.loading("Uploading...");
  
  try {
    const formData = new FormData();
    console.log("pfp", pfp);
    formData.append('pfp', pfp);

    // Use fetch to send the PUT request
    const response = await fetch(settingsEndpoints.UPDATE_DISPLAY_PICTURE_API, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,  // Token included in Authorization header
      },
      body: formData,  // Send formData directly in the body
    });

    const data = await response.json();  // Parse the response JSON
    console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", data);

    if (!data.success) {
      throw new Error(data.message);  // If there's an error in the response, throw it
    }

    toast.success("Profile Picture Updated Successfully");

    // Update the localStorage with the new image URL
    const imageUrl = data.data.image;
    localStorage.setItem(
      "user",
      JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), image: imageUrl })
    );
    console.log(JSON.parse(localStorage.getItem("user")).image);

  } catch (error) {
    console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
    toast.error(error.message || "Failed to update profile picture");
  }

  // Dismiss the toast
  toast.dismiss(toastId);
}



  export async function changePassword(token, formData) {
    
    const toastId = toast.loading("Loading...")
    console.log("api callling started.....")
    try {
      const response = await apiConnector("POST", CHANGE_PASSWORD_API, {formData, token}, {
        // Pass headers as an object
          Authorization:`Bearer ${token}`,
      
      });
      console.log("response is..",response)
      console.log("CHANGE_PASSWORD_API API RESPONSE............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Password Changed Successfully");
      console.log("api calling done");
    } catch (error) {
      console.log("CHANGE_PASSWORD_API API ERROR............", error)
      toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
  }
  
  
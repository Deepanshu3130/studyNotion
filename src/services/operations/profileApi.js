

import { apiConnector } from "../apiConnector";
import { porfileEndpoints } from "../api";
import { toast } from "react-hot-toast";
import {settingsEndpoints} from "../api"
import { setLoading } from "../../slices/profileSlice";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authApi";
//import { logout } from "./authAPI.js";


const {GET_USER_DETAILS_API, 
    GET_USER_ENROLLED_COURSES_API, 
    GET_INSTRUCTOR_DATA_API}=porfileEndpoints 

    export async function getUserCourses(token) {
      console.log("token in operation module ", token);
      let result = [];
      
      try {
        console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
        
        const response = await fetch(GET_USER_ENROLLED_COURSES_API, {
          method: "GET", // Method needs to be a string
          headers: {
            "Authorization": `Bearer ${token}`, // Correctly pass the token in the Authorization header
            "Content-Type": "application/json", // Ensure proper content-type
          },
        });
    
        console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    
        const data = await response.json(); // Parse the response as JSON
        console.log("result is" , data)
        
        if (!data.success) {
          throw new Error(data.message); // Handle error response
        }
    
        result = data.data; // Extract the course data from the response
        
      } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
        toast.error("Could Not Get Enrolled Courses"); // Display error message
      }
    
      return result; // Return the result
    }
    

    export function getUserDetails(token, navigate) {
        return async (dispatch) => {
          const toastId = toast.loading("Loading...")
          dispatch(setLoading(true))
          try {
            const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
              Authorization: `Bearer ${token}`,
            })
            console.log("GET_USER_DETAILS API RESPONSE............", response)
      
            if (!response.data.success) {
              throw new Error(response.data.message)
            }
            const userImage = response.data.data.image
              ? response.data.data.image
              : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
            dispatch(setUser({ ...response.data.data, image: userImage }))
          } catch (error) {
            dispatch(logout(navigate))
            console.log("GET_USER_DETAILS API ERROR............", error)
            toast.error("Could Not Get User Details")
          }
          toast.dismiss(toastId)
          dispatch(setLoading(false))
        }
      }

      
      
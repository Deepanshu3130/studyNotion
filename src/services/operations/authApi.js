import  {toast} from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"

import { endpoints } from "../api";

const {
 SENDOTP_API,
 SIGNUP_API,
 LOGIN_API,
 RESETPASSTOKEN_API,
 RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
       dispatch(setLoading(true));
       try{
        const response = await apiConnector("post" , SENDOTP_API,{
            email,
            checkUserPresent: true,

        });
        console.log("sendotp api response ....", response)
        console.log("response.data.success")

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("otp sent successfully")
        navigate("/verify-email")

       } catch(error){
        console.log("SENDOTP API ERROR............", error)
        toast.error("Could Not Send OTP")

       }
       dispatch(setLoading(false))
       toast.dismiss(toastId)
      

    }
}

export function signUp(
                 firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                    accountType,
                   // contactNumber,
                    otp,
                    navigate
  ) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SIGNUP_API, {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
        })
  
        console.log("SIGNUP API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Signup Successful")
        navigate("/login")
      } catch (error) {
        console.log("SIGNUP API ERROR............", error)
        toast.error(error)
        navigate("/signup")
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  
    export function login(email, password, navigate){
        return async(dispatch)=>{
            const toastId = toast.loading("Loading...")
            dispatch(setLoading(true))
            try{
                const response = await apiConnector("post" , LOGIN_API, {
                    email,
                    password,
                })
                console.log("LOGIN API RESPONSE............", response);
                if(!response.data.success){
                    throw new Error(response.data.error)
                }
                toast.success("login sucessfully")
                 dispatch(setToken(response.data.token));

                 const expiresIn = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now
                // setTimeout(()=>{
                //   logout(navigate)
                // }, expiresIn)

                 const userImage = response.data?.checkUser?.image
                 ? response.data.checkUser.image
                 : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.checkUser.firstName} ${response.data.checkUser.lastName}`
               dispatch(setUser({ ...response.data.checkUser, image: userImage }))

               localStorage.setItem("token", JSON.stringify(response.data.token)); // look into this
              localStorage.setItem("user", JSON.stringify(response.data.checkUser));
              localStorage.setItem("tokenExpiresIn", expiresIn);   // look into this
              navigate("/dashboard/my-profile") 
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }

  export function checkSessionExpiration(navigate) {
    const tokenExpiresIn = localStorage.getItem("tokenExpiresIn");
  
    if (tokenExpiresIn && Date.now() > tokenExpiresIn) {
      logout(navigate); // Automatically log the user out if the token is expired
    }
  }
  

  export function getPasswordResetToken(email,setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("post", RESETPASSTOKEN_API, {
                email,
            })
            console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setEmailSent(true);

        } catch(error){ console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Failed to send email for resetting password");
          }
          dispatch(setLoading(false));

        }
    }

    export function resetPassword(password, confirmPassword, token) {
        return async(dispatch) => {
          dispatch(setLoading(true));
          try{
            const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
      
            console.log("RESET Password RESPONSE ... ", response);
      
      
            if(!response.data.success) {
              throw new Error(response.data.message);
            }
      
            toast.success("Password has been reset successfully");
          }
          catch(error) {
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Unable to reset password");
          }
          dispatch(setLoading(false));
        }
      }
  
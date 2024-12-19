import React from 'react'
import {  Link, useNavigate } from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import { signUp, sendOtp} from '../services/operations/authApi';
import Spinner from '../component/common/Spinner';
import { BiArrowBack } from 'react-icons/bi';
import OtpInput from "react-otp-input";


function Verifymail() {
    const [otp, setOtp] = useState("");
    console.log(otp)
    const navigate= useNavigate()
    const{signupData , loading} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
        // Only allow access of this route when user has filled the signup form
        if (!signupData) {
          navigate("/signup");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    

    const handleVerifyAndSignup = (e) => {
        e.preventDefault();
        const {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          
        } = signupData;

    
        try {
            dispatch(
                signUp(
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword,
                    accountType,
                   
                    otp,
                    navigate
                )
            );
        } catch (error) {
            console.log("Error during signup:", error);
        }
        
    }
  return (
    <div className='w-11/12 flex items-center justify-center mx-auto  min-h-[calc(100vh-3.5rem)] '>

      { loading? (<div className='flex item-center justify-center'><Spinner></Spinner></div>)
      :(<div>
        <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", // see styling while revison and remove all the comments
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => dispatch(sendOtp(signupData.email))}
            >
              {/* <RxCountdownTimer /> see this later on  */}
              Resend it
            </button>
          </div>


      </div>)

      }


    </div>
  )
}

export default Verifymail
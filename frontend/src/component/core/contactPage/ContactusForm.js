import React from 'react'
import CountryCode from "../../../data/countrycode.json"
import { useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';

function ContactusForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },

  }= useForm();

  function submitContactForm(data){
    console.log("submit form data is ", data) ;
    //make handle control controller in the server to handle it 
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  const [loading, setLoading] = useState(false)
  return (
    <div className=" flex justify-center items-center">
      <form className="flex flex-col gap-7 " onSubmit={handleSubmit(submitContactForm)}>

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor='firstName' className="lable-style">first Name</label>
            <input id='firstName'
            placeholder='please enter your firstName'
            type="text"
           className="form-style"
           {...register("firstname" , {required:true})}
            ></input>
            {errors.firstname && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                please enter your name 
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor='lastName' className="lable-style" >Last Name</label>
            <input id='lastName'
            placeholder='please enter your lastName'
            type="text"
           className="form-style"
           {...register("lastname")}
            ></input>
          </div>

        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor='email'  className="lable-style">Email Address</label>
          <input id='email'
              placeholder='please enter your email'
              type="email"
              className="form-style"
              {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>

        <div  className="flex flex-col gap-2">
           <label htmlFor='phoneNumber' className="lable-style"> phone number</label>
           <div className='flex gap-5'>
             <div  className="flex w-[81px] flex-col gap-2">
              <select 
              type = "number"
              name="contryCode"
              id="contryCode"
              placeholder=""
              className="form-style"
              {...register("countrycode", { required: true })}>
                {
                  CountryCode.map((data, index)=>(
                    <option key={index} value={data.code}>
                    {data.code}- {data.country}
                    </option>
                  ))


                }
              </select>
             </div>

             <div className="flex w-[calc(100%-90px)] flex-col gap-2">
               <input 
               type='number'
               name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { 
                  value: 12, message:
                   "Invalid Phone Number"
                    },
                minLength: { 
                  value: 10, 
                  message: "Invalid Phone Number" 
                  },
              })}>

              </input>

             </div>
 
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errors.phoneNo.message}
          </span>
        )}
        </div>

      <div className="flex flex-col gap-2">
       <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="form-style"
          {...register("message", { required: true })}
        /> 
         {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
       </div>

       <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"  //see this 
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
      </form>


    
    </div>
  )
}

export default ContactusForm
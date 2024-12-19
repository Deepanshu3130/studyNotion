import React from 'react'
import ContactDetails from '../component/core/contactPage/ContactDetails'
import Contactform from '../component/core/contactPage/Contactform'
function ContactUs() {
  return (
    <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>
        
        <div className="lg:w-[60%]">
            <Contactform/>
        </div>
    </div>

     
  )
}

export default ContactUs
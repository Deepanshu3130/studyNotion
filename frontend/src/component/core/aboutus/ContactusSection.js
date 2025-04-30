import React from 'react'
import ContactusForm from '../contactPage/ContactusForm'
function ContactusSection() {
  return (
    <div className="mx-auto">
        <div>
            <h1 className="text-center text-4xl font-semibold">Get in touch</h1>
            <p className="text-center tracking-wide  text-richblack-300 mt-3 mb-5"> We'd love to here for you,
             Please fill out this form.</p>
             <div className="mt-12 mx-auto"></div>
            <ContactusForm></ContactusForm>
        </div>
    </div>
  )
}

export default ContactusSection
import {RingLoader} from "react-spinners"
import React from 'react'

function Spinner() {
  return (
    <div>
        <RingLoader  color="blue" className="flex items-center justify-center"></RingLoader>
    </div>
  )
}

export default Spinner
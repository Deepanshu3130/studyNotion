import React from 'react'
 const Stats =[
    {stats:"5K",
    label:"Active students"
    },
    {stats:"10+",
    label:"Members"},
    {stats:"200+",
    label:"courses"},
    {stats:"50+",
    label:"Awards"},
]
function AboutStats() {
  return (
    <div className="flex flex-row gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto " >
     
       {
        Stats.map((value, index)=>{
            return (
                <div key={index} className="flex flex-col py-10">
                    <p className="text-[30px] text-center font-bold text-richblack-5">{value.stats}</p>
                    <p className="font-semibold text-[16px] text-richblack-500">{value.label}</p>
                </div>
            )
        })
       }

    </div>
  )
}

export default AboutStats
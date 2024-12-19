const Section = require("../Model/section");
const Course= require("../Model/Course") ;

//we have to write three handlers here..
//1 is create section
//2 is is to update section
//3 is delete section
exports.createSection = async(req, res)=>{
    console.log("enterd in the create course controller")
    console.log(req.body)
    try{
    //fetch all the things neccssary course id too
    const{sectionName,courseId} = req.body.data;
    console.log(sectionName  ,  courseId )

    //validate
    if(!sectionName || !courseId){
        return res.json({
            success:false,
            message:"please enter the valid data"
        })
    }

    //insert in section
    const newSection = await Section.create({sectionName});

     // update in course schema too
    const updatedCourse= await Course.findByIdAndUpdate(courseId , {$push:{courseContent:newSection._id}},
    {new:true}) .populate({
        path: "courseContent",
        populate :{
           path :"subSection",
        }
     }) 
        // use populate to replace section and sub sections

    //return response
    return res.status(200).json({
        success:true,
        message:"section added successfully",
        updatedCourse,

    })
   
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"not able to create the section",
            error:error.message
        })

    }

}

exports.updateSection = async(req , res)=>{
    try{
        //fetch the data to updated
        const{sectionName , sectionId} = req.body; //section id hm khud se bejenge

        //validate the data
        if(!sectionName|| !sectionId){
            return res.json({
                success:false,
                message:"please enter the valid data"
            });
        }
        //find the section id and update according to that
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        //kya courses se bhi delete karne ki need ha ?? will see later
        // return res
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
            updatedSection,
    
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"updatation fail",
            error:error.message
        })

    }

}

exports. deleteSection= async(req, res)=>{
    try{
        //fetch the section id
        const{sectionId} = req.body;
        //use find by id and delete
        const deletedSection = await Section.findByIdAndDelete(sectionId)
        //return response
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            deletedSection,
    
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"deltion fail",
            error:error.message
        })
    }
}
const SubSection = require("../Model/subSection");
const Section = require("../Model/section");
const {uploadImageToCloudinary} = require("../utility/fileUpload");
require("dotenv").config();
const Course = require("../Model/Course")


//here also the same create update and delete

exports.createSubSection = async(req, res)=>{
    try{
        //for creating the section we need title timeduration description and videoUrl and sectionid to update in section
        //fetch
        const{title , description , sectionId,courseId} = req.body;
        const file = req.files.videoFile;
        //validate
        if (!sectionId || !title || !description || !file || !courseId ) {
			return res
				.status(404)
				.json({ success: false, message: "All Fields are Required" });
		}
        const ifsection= await Section.findById(sectionId);
		if (!ifsection) {
            return res
                .status(404)
                .json({ success: false, message: "Section not found" });
        }
        const details = await uploadImageToCloudinary(file , process.env.FOLDER_NAME);
        const secure_url= details.secure_url;
        console.log(details)
        //create
        const SubSectionDetails = await SubSection.create({
             title:title,
             
              description: description, 
              videoUrl:secure_url});
        //update
        const updatedSection = await Section.findByIdAndUpdate(
			{ _id: sectionId },
			{ $push: { subSection: SubSectionDetails._id } },
			{ new: true }
		).populate("subSection");  // doubt in passing the id 
        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } }).exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"subsection created successfully",
            updatedCourse,
        })

        

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"not able to create the SubSection",
            error:error.message
        })

    }
}


exports.updateSubSection = async(req, res)=>{
    try{
        //fetch
        const{title , timeDuration , description , subSectionId} = req.body;
        const file = req.files.videoFile;
        //validate
        if(!title || !timeDuration || !description||!file||!subSectionId){
            return res.json({
                success:false,
                message:"please fill all the entries",
            });
        }
        const details = uploadImageToCloudinary(file , process.env.FOLDER_NAME);
        const secure_url= details.secure_url;
        //update
        const updatedSection = await SubSection.findByIdAndUpdate( subSectionId ,{title, timeDuration, description,videoUrl:secure_url },
        {new:true})

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"not able to update the SubSection",
            error:error.message
        });

    }
}


exports.deleteSubSection = async(req, res)=>{
    try{
        //fetch the subsection id
        const{subSectionId, courseId} = req.body;
        const sectionId=req.body.sectionId;
        
        if(!subSectionId || !sectionId){
            return res.status(404).json({
                success: false,
                message: "all fields are required",
            });
        }
        const ifsubSection = await SubSection.findById({_id:subSectionId});
	    const ifsection= await Section.findById({_id:sectionId});

        if(!ifsubSection){
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }
        if(!ifsection){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        //use find by id and delete
        await SubSection.findByIdAndDelete(subSectionId);
        await Section.findByIdAndUpdate({_id:sectionId},{$pull:{subSection:subSectionId}},{new:true});
        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } }).exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"subsection deleted successfully",
            updatedCourse,
    
        });


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"updatation fail",
            error:error.message
        })
    }
}
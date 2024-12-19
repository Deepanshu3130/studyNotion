const profile = require("../Model/profile");
const Profile = require("../Model/profile");
const User = require("../Model/user");
const Course = require("../Model/Course")
const { uploadImageToCloudinary } = require("../utility/fileUpload")
const { convertSecondsToDuration } = require("../utility/secToDuration") // see this

exports.updateProfile= async(req, res)=>{
   try{
     //find the user id=> find user => find addtionaldetails ==> save deatils
     //fetch data from req body
     const{ 
      firstName = "",
      lastName = "",
      dateofBirth="",
      about="", 
      contactNumber=" ",
       gender =" "} = req.body.formdata;

     const id = req.user.id;
     if(!contactNumber||!gender||!id){
         return res.status(400).json({
             success:false,
             message:"all the fields are neccessary "
         })
 
     }
     const userDetails= await User.findById(id);
     const profileId= await userDetails.additionalDetails;
     const profileDetails= await Profile.findById(profileId);
      

     const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    }, {new : true});
    await user.save()
     //update profile
     profileDetails.dateofBirth =dateofBirth;
     profileDetails.about= about;
     profileDetails.contactNumber= contactNumber;
     profileDetails.gender = gender;
 
     await profileDetails.save();

     const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

 
     //return response
     return res.status(200).json({
         success:true,
         message:"profile updated Successfully",
         updatedUserDetails,
     })
 }
 catch(error){
    return res.status(500).json({
        success:false,
        error:error.message
    });

   }
  

}

//delete account
exports.deleteAccount = async(req, res)=>{
  console.log("in the delete profile route")
    try{
        const id = req.user.id;
        
        const userDetails= await User.findById(id);
        console.log(userDetails);
        if(!userDetails){
            return res.status(500).json({
                success:false,
                message:"user not found"
            });
        }
        //delete profile of user
        await profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        console.log(profile)

        // for(const courseId of User.courses){
        //   await Course.findByIdAndUpdate(
        //     courseId,
        //     {
        //       $pull :{studentsEnrolled: id}
        //     },{new:true}
        //   )
        // }
        
        
        //delete user
        await User.findByIdAndDelete(id);
       

      //  await Course.findByIdAndDelete({})

        //return res
        return res.status(200).json({
            success:true,
            message:"profile updated Successfully",
            //profileDetails,

        })

    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message
        });
    }

}
exports.getAllUserDetails = async (req, res) => {
    try {
      const id = req.user.id
      const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()
      console.log(userDetails)
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

exports.updateDisplayPicture = async (req, res) => {
	try {

		const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	const image = req.files.pfp;
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
	}



}
  
exports.getEnrolledCourses=async (req,res) => {
	try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const enrolledCourses = await User.findById(id).populate({
			path : "courses",
				populate : {
					path: "courseContent",
			}
		}
		).populate("courseProgress").exec();
        // console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
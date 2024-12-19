const Course = require("../Model/Course");
const User = require("../Model/user");
const Category= require("../Model/Category");
const {uploadImageToCloudinary} = require("../utility/fileUpload");
const CourseProgress = require("../Model/CourseProgress")
//steps
//fetch data from the req body
   exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;
        console.log(userId)

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;
        console.log(req.body.status)
		
        console.log(courseName, price)

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});
		console.log(instructorDetails)

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		console.log(categoryDetails)
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);
		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn:whatYouWillLearn,
			price,
			tag:tag,
			category,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});
        		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

//get all course data
exports.getAllCourses =async(req, res)=>{
    try{
        const allCourses=await Course.find({},{name:true, description:true});
    res.status(200).json({
        success:true,
        messgae:"All courses return successfully",
        allCourses ,
    });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message 
        })
    }
};

//get course Details
exports.getCourseDetails=async(req, res)=>{
    try{
        //get the course id
        const{courseId} = req.body;
        //find the course details
        const courseDetails= await Course.find({_id:courseId})
                                            .populate({
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",

                                                },
                                            })
                                            .populate("category")
                                            //.populate("ratingsAndReviews")   //for nested ppopulate
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection",
                                                }
                                            }) .exec();
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"could not find the course",
              
            })
        }
		return res.status(200).json({
			success:true,
			message:"Course fetched successfully now",
			data:courseDetails
		});

    }catch(error){
        return res.status(500).json({
            success: false,
			message:`Can't Fetch Course Data`,
            message:error.message 
        })

    }
}

exports.fetchInstructorCourses = async(req, res)=>{
	try{
		const userId = req.user.id;
		const courses = await Course.find({instructor: userId});

		if(courses){
			return res.status(200).json({
				success: true,
				message:"all instructor courses fetched successfully",
				data: courses

			})
		}

	}catch(error){
		// Handle any errors that occur during the fetching of the courses
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});

	}
}


exports.markLectureAsComplete = async(req, res) =>{
    const{courseId , subSectionId, userId} = req.body;
    if(!courseId || !subSectionId || !userId) {
        return res.json({
            sucess: false,
            message:"please fill all the entries"
        })
    }
//    see the logic of chicking the completed course array later if needed
   try{
    const progressAlreadyExists = await CourseProgress.findOne({
		userId: userId,
		courseId: courseId,
	})
	const completedVideos = progressAlreadyExists.completedVideos
	if(!completedVideos.includes(subSectionId)){
		await CourseProgress.findOneAndUpdate({
			userId:userId,
			courseId: courseId,
		},{
			$push :{completedVideos : subSectionId}
		})
	}else{
		return res.status(400).json({
			success: false,
			message: "Lecture already marked as complete",
		  })
	  }
	  return res.status(200).json({
		success: true,
		message: "Lecture marked as complete",
	  })
	  } catch (error) {
		return res.status(500).json({
		  success: false,
		  message: error.message,
		})
	  }
   }


   exports.getFullCourseDetails = async (req, res) => {
	try {
		console.log("req in the getFullCourseDetails")
	  const { courseId } = req.body
	  const userId = req.user.id
	  const courseDetails = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		                                   //.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
		  },
		})
		.exec()

		
	  let courseProgressCount = await CourseProgress.findOne({
		courseId: courseId,
		userId: userId,
	  })
  
	  console.log("courseProgressCount : ", courseProgressCount)
  
	  if (!courseDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find course with id: ${courseId}`,
		})
	  }
  
	  // if (courseDetails.status === "Draft") {
	  //   return res.status(403).json({
	  //     success: false,
	  //     message: `Accessing a draft course is forbidden`,
	  //   });
	  // }
  
	//   let totalDurationInSeconds = 0
	//   courseDetails.courseContent.forEach((content) => {
	// 	content.subSection.forEach((subSection) => {
	// 	  const timeDurationInSeconds = parseInt(subSection.timeDuration)
	// 	  totalDurationInSeconds += timeDurationInSeconds;
	// 	})
	//   })
  
	//   const totalDuration = convertSecondsToDuration(totalDurationInSeconds)   note-> see this login if needed
  
	  return res.status(200).json({
		success: true,
		data: {
		  courseDetails,
		 //totalDuration,
		  completedVideos: courseProgressCount?.completedVideos
			? courseProgressCount?.completedVideos
			: ["none"],
		},
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }



  exports.editCourse = async (req, res) => {
	try {
	  const { courseId } = req.body.data
	  const updates = req.body.data
	  console.log(updates)
	  const course = await Course.findById(courseId)
  
	  if (!course) {
		return res.status(404).json({ error: "Course not found" })
	  }
  
	  // If Thumbnail Image is found, update it
	  if (req.files) {
		console.log("thumbnail update")
		const thumbnail = req.files.thumbnailImage
		const thumbnailImage = await uploadImageToCloudinary(
		  thumbnail,
		  process.env.FOLDER_NAME
		)
		course.thumbnail = thumbnailImage.secure_url
	  }
  
	  // Update only the fields that are present in the request body
	  for (const key in updates) {
		if (updates.hasOwnProperty(key)) {
		  if (key === "tag" || key === "instructions") {
			course[key] = JSON.parse(updates[key])
		  } else {
			course[key] = updates[key]
		  }
		}
	  }
  
	  await course.save()
  
	  const updatedCourse = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		          //.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
		  },
		})
		.exec()
  
	  res.json({
		success: true,
		message: "Course updated successfully",
		data: updatedCourse,
	  })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  })
	}
  }


  exports.editStatus = async(req, res)  =>{
	
	try{
		const {courseId , status} = req.body.data;
	if(!courseId){
		return res.json({
			success: false,
			message:"course id is missing "
		})
	}
	const result = await Course.findByIdAndUpdate(courseId ,
		{status: status} ,
		{new:true}
	)
	if (!result) {
		return res.status(404).json({
			success: false,
			message: "Course not found"
		});
	}
	   // If the update was successful
	   return res.status(200).json({
		success: true,
		message: "Status updated successfully",
		data: result
	});
	}catch(error){
		console.error(error)
		res.status(500).json({
		  success: false,
		  message: "cannot update the course",
		  error: error.message,
		})
	}


  }
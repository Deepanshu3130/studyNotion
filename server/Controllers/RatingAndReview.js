const RatingAndReview = require("../Model/RatingAndReview");
const User = require("../Model/user");
const Course= require("../Model/Course");

exports.createRating = async(req, res)=>{
    try{
        //fetch details
        const{review , rating, courseId } = req.body;
        const id = req.user.id;

        //validations 1=> user is registor in the course or not 
        const courseDetails = await Course.findone({_id:courseId,
             studentsEnrolled:{$elemMatch:{$eq:id}}  //check this out
            });
            if(!courseDetails){
                return res.status(404).json({
                    success:false,
                    message: "student is not enrolled in the course"

                });
            }
        //2=>user has already given the reviews
        const alreadyReviewed = await RatingAndReview.findone({user:id});
        if(alreadyReviewed){
            return res.status(404).json({
                success:false,
                message:"you have already given your review"
            })
        }
        // insert the data in the 
        const newReview = await RatingAndReview.create({review, rating , user:id, course:courseId})
        //update the review in the course....
        const updateCourse = await Course.findByAndUpdate(courseId ,{$push:{ratingsAndReviews:newReview._id}}, {new:true})

        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created Successfully",
            newReview,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
   
}

exports.getAverageRating = async(req, res) =>{
    try{
        //get the course id
        const courseId = req.body.course;
        //calculate the aav rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.objectId(courseId), //look into this
                },  
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ]);
        //return ratings
        if(result.length>0){
            return res.satus(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"Average rating is 0 no rating is given til now  " 
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get all rating and review
exports.getAllRatings=async(req,res)=>{
    try{
        const allReviews=await ratingsAndReviews.find({}).sort({rating:"desc"})
                                                .populate({
                                                    path:"User",
                                                    select:"firstName lastName email image",

                                                })
                                                .populate({
                                                    path:"Course",
                                                    select:"courseName"});
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
            
        })
    }
    catch(error){

        console.log(error);
        
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
}
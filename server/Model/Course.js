const mongoose = require("mongoose");

const course = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section" 
    }],
    ratingsAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,

    },
    instructions:{
        type: [String],
		required: true,

    },
    tag: {
		type: [String],
		required: true,
	},
    category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
   studentsEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
	],

    status: {
		type: String,
		enum: ["Draft", "Published"],
	},

}); 
module.exports = mongoose.model("Course", course)
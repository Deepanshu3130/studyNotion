const Category = require("../Model/Category");
const Course = require("../Model/Course");
//const CourseProgess = require("../Model/CourseProgress")

exports.createCategory = async(req , res)=> {
    try{
        //fetch data
        const{name, description} = req.body;
        //validation
        if(!name|| !description){
            return res.json({
                success:false,
                message:"please fill all the details"
            })
        }
        //create the enty in the detail
        //dont ve confused it the admin who is making the tags in the starting rest all the things will done later
        const categoryDetails = await Category.create({name,
        description});
        console.log(categoryDetails);
        //return response
        return res.status(200).json({
            success: true,
            message:"categories are Created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message
        })

    }
}

//get all category handler
exports.getCategory =async(req, res)=>{
    try{
        const allCategory=await Category.find({});
    res.status(200).json({
        success:true,
        messgae:"All categories return successfully",
        allCategory,
    });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

//make all this into category



exports.categoryPageDetails= async(req, res)=>{
    console.log("call is in categoty page detail ")
    try{
        //get categoryId
        const{categoryId} = req.body;
        console.log("categry id is" , categoryId)
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
                                .populate({path: "course" , populate:([{path:"instructor"}])})
                                .exec();
        console.log(selectedCategory);
        if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}

        // //validatioon
        // if(selectedCategory.course.length === 0){
        //     return res.status(404).json({
        //         success:false,
        //         message:"Data not found",
        //     })
        // }
        // Handle the case when there are no courses
		if (selectedCategory.course.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}
        const selectedCourses = selectedCategory.course.filter((course) => course.status === "Published");
        //get courses for different categories
        const differentCategories= await Category.find({
                                        _id:{$ne:categoryId},
        })  .populate({path: "course", match:{status:"Published"} , populate:([{path:"instructor"}])})
        .exec()

       const differentCourses = differentCategories.flatMap((category)=> category.course)

        //get top selling courses HW

        const allCategory = await Category.find().populate({path:"course",match:{status:"Published"},populate:([{path:"instructor"}])}).exec();
        const allCourses = allCategory.flatMap((category) => category.course);
        const mostSellingCourses =allCourses.sort((a,b)=>b.sold - a.sold).
        slice(0,10)

        //return response
        return res.status(200).json({
            
            
                selectedCourses : selectedCourses,
                differentCourses : differentCourses,
                mostSellingCourses:mostSellingCourses,
                success : true
           
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            message:error.message
        });
    }
}

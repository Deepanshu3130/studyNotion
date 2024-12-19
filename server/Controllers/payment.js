 const {instance} = require("../config/razorpay");
 //const { default: mongoose } = require("mongoose");
const Course = require("../Model/Course");
const user = require("../Model/user");
 const User = require("../Model/user");
 const mailSender = require("../utility/mail");
 const mongoose = require("mongoose");
 require("dotenv").config();
 const crypto = require("crypto");
 const {courseEnrollmentEmail} = require("../../server/templates/mail/courseEnrollmentEmail")
 const {  paymentSuccessEmail } = require("../../server/templates/mail/paymentSuccessEmail");


// //capture the payment and initiates the razorpay order
// exports.capturePayment = async(req, res)=>{
//     //get the course id and user id
//     const {course_id} = req.body;
//     const userId= req.user.id;

//     //validations
//     if(!course_id){
//         return res.json({
//             success:false,
//             message:"please provide the valid course id"

//         });   
//     }
//     let course = await Course.findById(course_id);

//     if(!course){
//         return res.json({
//             success:false,
//             message:"could not find the course",
//         });
//     }

//     //user already pay for the same course
//     const uid = new mongoose.Types.objectId(userId);
//     if(course.studentEnrolled.includes(uid)){
//         return res.status(200).json({
//             success:false,
//             message:"Student is already enrolled",
//         });
//     }

//     //now create the order
//     const amount = course.price;
//     const currency ="INR"

//     const options={
//         amount:amount*100,
//         currency,
//         receipt:Math.random(Date.now()).toString(),
//         notes:{
//             courseId:course_id,
//             userId,
//         }
//     };

//     try{
//         //crerte the order
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             CourseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount

//         });
//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:"could not initiates the order"
//         })
//     }

// }

// exports. verifysignature=async(req, res)=>{
//     const webhookSecret = "123445678"
//     const signature = req.header["x-razorpay-signature"];

//     //three steps for converting the Secrete same as commimng from the razorpay;
//     const shasum = crypto.createHmac("sha256" , webhookSecret);
//     shasum.upadate(json.stringify(req.body));
//     const digest= shasum.digest("hex");
//     if(signature === digest){
//         console.log("payment is Authorise");

//         const{courseId, userId} = req.body.payload.payment.entity.notes;  // check this while testing

//         try{
//             const enrolledCourses= await Course.findOneAndUpdate({courseId},{$push:{studentsEnrolled:userId}}, {new:true});
//             if(!enrolledCourses){
//                 return res.status(500).json({
//                     success:true,
//                     message:"course not found"
//                 });
//             }
//             console.log(enrolledCourses);

//             //now find the students and add course to it 

//             const enrolledStudents= await User.findOneAndUpdate(userId ,{$push:{courses:courseId}}, {new:true});

//             console.log(enrolledStudents);

//             //send the confirmation mail
//             const emailResponse = await mailSender(
//                 enrolledStudents.email,
//                 "congratulations you have been enrolled in the course ",
//                 "add templete here later on "
//             );
//             console.log(emailResponse);
//             return res.status(200).josn({
//                 success:true,
//                 message:"signature verified"
//             })


//         }catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             })

//         }

//     }else{
//         return res.status(400).json({
//             success:false,
//             message:"Invalid req"
//         })
//     }

    
// };
exports .capturePayment = async(req , res ) =>{
    try{

        const {courses} = req.body
        const userId = req.user.id

        if(courses.length===0){
            return res.json({
                success:false,
                message: " no courses found",
            })
        }
        let totalAmount=0;
        for(const course_Id of courses){
            let course
            try{
                course = await Course.findById(course_Id);
                if(!course){
                    return res.json({
                        success:false,
                        message:"course not found"
                    });
                };
                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid)){
                    return res.json({
                        success:false,
                        message:"student is alreay enrolled"
                    });
                }
                totalAmount += totalAmount+course.price
            }
            catch(error){
                console.log(error);
                return res.json({
                    sucess:false,
                    message:error.message
                })
            }

           
        }

        const options={
            amount: totalAmount * 100,
            currency:"INR",
            receipt:Math.random(Date.now()).toString()
        }
        try{
            const paymentResponse = await instance.orders.create(options);
            return res.json({sucess:true, message:paymentResponse})
        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message: "could not initiate the order",
               data:console.log(error)
                
            })
        }


    }catch(error){
        console.log(error);
        return res.json({
            success: false,
            message: error.message

        })


    }

}
exports.verifyPayment = async(req, res)=>{
     const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
    const {courses} = req.body;
    const userId = req.user.id
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature
         || !courses || !userId){
            return res.status(200).json({
                success: false,
                message: "payment failed"
            })
     };
     let body = razorpay_order_id + "|" + razorpay_payment_id
     const expectedSignature = crypto.createHmac("sha256" , process.env.RAZORPAY_SECRET)
       .update(body.toString()).digest("hex")

    if(expectedSignature === razorpay_signature){
        await studentsEnrolled(courses , userId , res)
        return res.status(200).json({
            success:true,
            message:"payment verified"
        })
    }

    return res.status(200).json({
        success: false,
        message:"payment failed"
    })

}

const studentsEnrolled = async(courses , userId , res)=>{
    if(!courses || !userId) {
        return res.status(400).json({
            success:false,
            message:'Please provide valid courses and user ID',
        });}
    for( const id of courses){
        const result = await Course.findByIdAndUpdate(id,
            {$push:{studentsEnrolled:userId}},
            {new:true}
        )
        if(!result){
            return res.status(500) . json({
                success : false,
                message:"Courses mot found"
            })
        }

        const result2 = await User.findByIdAndUpdate(userId , 
            {$push :{courses:id}} , {new:true}
        )

        if(!result2){
            return res.status(500).json({
                success: false,
                message: "couldnt add the courses in the user"
            })

        }

        const mailResponse = await mailSender(
            result2.email,
            `Sucessfully Enrolled into ${result.courseName}`,
            courseEnrollmentEmail(result.courseName , `${result2.firstName + result2.lastName }`)
        )
    }

}

exports.sendVerificationMail = async(req, res) =>{
  const {amount , paymentId , orderId} = req.body;
  const userId = req.user.id;

 
    if(!amount || !paymentId) {
        return res.status(400).json({
            success:false,
            message:'Please provide valid payment details',
        });
    }

    try{
        const enrolledStudents = await User.findById(userId)
        const email = enrolledStudents.email
        await mailSender(enrolledStudents.email , 
            `Study Notion Payment successful`,
            paymentSuccessEmail(amount/100, paymentId, orderId, enrolledStudents.firstName, enrolledStudents.lastName),
        )
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}
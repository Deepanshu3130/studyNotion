const mongoose = require("mongoose");
const mailSender=require("../utility/mail");
const emailTemplate = require("../templates/mail/emailVerifiationEmail");



const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
       
    },
    otp:{
        type:String,
        required: true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        // expires:10*60,
        
    },
});

//a function -> to send emails
async function sendverificationEmail(email ,otp){
    //create a transporter to send mails
    try{ 
         const mailResponse= await mailSender(email , "verification Email" ,emailTemplate(otp));
         console.log("email sent Successfully" , mailResponse)

    }
    catch(err){
        console.log("error occoured while sending the mails" , err);
        throw err;
    }

}

otpSchema.pre("save" , async function(next){
    await sendverificationEmail(this.email , this.otp);
    next();
})
module.exports = mongoose.model("Otp" , otpSchema);
const User = require("../Model/user");
const Otp = require("../Model/OTP");
const otpGenerator = require("otp-generator");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const Profile = require("../Model/profile")
const mailSender= require("../utility/mail")
const passwordUpdated = require("../templates/mail/passwordUpdate");


//generate otp
exports.sendOtp = async(req, res)=>{
    try{
        //fetch email from the req body
        const {email} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                success:false,
                messange:"user already present plaese login "
            })
        }

        
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      const result = await Otp.findOne({ otp: otp })
      console.log("Result is Generate OTP Func")
      console.log("OTP", otp)
      console.log("Result", result)
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        })
      }
        //now enter this unique otp in the db
        const otpPayload = {email , otp}
        const otpBody= await Otp.create(otpPayload);
        console.log(otpBody);

        //return response successfull
        res.status(200).json({
            success:true,
            message:"otp is successfully sent",
            otp,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"otp cannot be sent"

        })
    }

}

//signUP
exports.signUp = async(req, res)=>{
    try{
        //fetch all the data from the req body

        const{firstName , lastName , email , password, 
            confirmPassword, accountType,  otp 
        } = req.body;
        

        console.log(req.body)

        //validation
        if(!firstName||!lastName || !email || !password || !confirmPassword || !otp){
            return res. status(403).json({
                success:false,
                message:"All fields are require"
            })

        }

        //match both the pass
        if(password !== confirmPassword){
            return res. status(400).json({
                success:false,
                message:"password is not matching"
            })
        }

        //check if user already exist oor not
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({
                success:false,
                message:"user already exist please login"
            });
        }

        //find the most recent Otp for this user
        const recentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1); // look into this 
        const response= recentOtp[0];
        //validate otp 
        //console.log("otp is ",recentOtp)

        if(recentOtp.length==0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:" Otp not found "
            })
        }
        
        else if(otp !== response.otp){
            //invalid otp
            console.log("main otp is",response.otp)
            return res.status(400).json({
                success:false,
                message:"Invalid Otp"
            });
        }
          
        

        //HASH PASS
        const hashPass =await bycrypt.hash(password, 10);

        // create entry in DB

        const additionalDetails = await Profile.create({
            gender:null,
            dateofBirth:null,     //  abhi ye hmne user mai update nhi kiya
            about:null,
            contactNumber:null,

        })
        const user = await User. create({firstName , lastName , email , password:hashPass, 
            confirmPassword, accountType,additionalDetails:additionalDetails._id,  otp , image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`  // save this api for avatr 

        })
        //console.log(hashPass)
        //return res
        return res.status(200).json({
            success:true,
            message:"user registered successfully",
            user,
        });

        

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be register please try again"

        })
    }
}

    //login 
exports.login = async(req, res)=>{

    try{
        const{email , password} = req.body;
        //validation of email and pass
    if(!email || !password){
        return res.status(403).json({
            success:false,
            message:"please fill all the entries"
        })
    } 
    // check if the user is present or not
    const checkUser = await User.findOne({email}).populate("additionalDetails")
    if(!checkUser){
        return res.status(401).json({
            success:false,
            message:"user is not registered please signin first"
        })
    }
    //match the pass 
    //generate the jwt tokens and send

    if(await bycrypt.compare(password,checkUser.password)){
       
        const payload={
            email: checkUser.email,
            id:checkUser._id,
            role:checkUser.accountType,

        }
        const token = jwt.sign(payload , process.env.JWT_SECRET ,{
            expiresIn:"48h"
        })

        checkUser.token = token;
        await checkUser.save();
        const options={
            htppOnly:true,
            expires:new Date(Date.now() + 3*24*60*60*1000),

        }
        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            checkUser,
            message:"Logged in successfully"
        })
    }

    else{
        return res.status(401).json({
            success:false,
            message:"password is not incorrect"
        });
    }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login fail"

        })

    }

}
//change password
//get data
//get oldPassword , newpassword  , confirmpass
//validation
//update in db
//send mail
//return response
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      console.log("in change pass controller")
     
      const userDetails = await User.findById(req.user.id)
      console.log(userDetails);
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body.formData
      console.log(oldPassword, newPassword)
    
  
      // Validate old password
      const isPasswordMatch = await bycrypt.compare(
        oldPassword,
        userDetails.password
      )
      console.log(isPasswordMatch);
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bycrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }
 // many corrections are needed to done in this... // mail sending is also left
// update pass controller needed







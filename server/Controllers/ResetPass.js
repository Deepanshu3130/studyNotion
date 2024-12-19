const User= require("../Model/user");
const mailSender= require("../utility/mail");
const bcrypt= require("bcrypt")

//resetPasswordToken
exports.resetPasswordToken= async(req, res)=>{
    try{
        //get email
    const {email} = req.body;
    //check user for email and validity
    const user = await User.findOne({email});
    if(!user){
        return res.status(500).json({
            success:false,
            message:"Your Email is not registered"
        })
    }
    //generate the token for adding the reseting link so that every time a new link can be generated
    const token=crypto.randomUUID();  // * read more about this 
    //update user by adding the token and expire time 
    const updateDetails = await User.findOneAndUpdate({email}, {token:token,
    resetPassExpires:Date.now()+ 5*60*1000}, {new:true})
    //create the url
    const url= `http://localhost:3000/update-password/${token}`
    //send mail containing the url
    await mailSender(email, "Password Reset Link", `password Reset Link:${url}`);
    //return the response
    return res.json({
        success:true,
        message:"Email is sent successfully, please check the mail and change your pass "
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in sending the mail "

        })

    }

}

//actual reset 

exports.resetPassword = async(req , res)=>{
    try{
            //fetch the data 
        const {password , confirmPassword, token} = req.body;
        //validation 
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"passwords not mathing"
            });
        }
        //get the userdetails from the db
        const userDetails = await User.findOne({token:token}); // we have foumd the user  with the help of token
        if(!userDetails){
            return res.json({
                success: false,
                message: "token is invalid"
            })
        }
        //token time check
        if(userDetails.resetPassExpires<Date.now()){
            return res.json({
                success:true,
                message:"token is expired"
            })
        }
        //hash password
        const hashPass = await bcrypt.hash(password , 10);
        //pass update
        await User.findOneAndUpdate({token:token},
        {password:hashPass}, {new:true});

        //return response
        return res.status(200).json({
            success:true,
            message:"password reset successfully"
        })
    }
catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in sending the mail "

        })

    }

}
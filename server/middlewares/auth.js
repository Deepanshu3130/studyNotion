const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    console.log("call in the auth middleware");
    console.log(req.body);
   // console.log("token in backend is " , req.header("Authorization").replace("Bearer ", "") )
    try{
        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorization").replace("Bearer ", "");
                        console.log('Request Headers:', req.headers);
                        

                        // Log specific headers like Authorization
                        console.log('Authorization Header:', req.headers.authorization);
                      
        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode= ",decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

exports.isStudent= (req, res , next) =>{
    try{
        if(req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "this is proteccted route for student ",
            })
        }
        next();


    }catch(err){

        return res.status(500).json({
            success : false,
            message:"role is not matching "
        })

    }
}

exports.isAdmin = (req, res , next) =>{
    try{
        if(req.user.role !== "Admin") {
            return res .status(401).json({
                success: false,
                message: "this is proteccted route for Admin  ",
            })
        }
        next();


    }catch(err){

        return res.status(500).json({
            success : false,
            message:"role is not matching "
        })

    }
}
exports.isInstructor= (req, res , next) =>{
    console.log("call in  the instructor auth middleware")
    try{
        console.log(req.user.role)
        if(req.user.role !== "Instructor") {
            return res.status(401).json({
               
                success: false,
                message: "this is proteccted route for instructor ",
            })
        }
        console.log("call is transfring from innstructor")
       
        next();
        


    }catch(err){

        return res.status(500).json({
            success : false,
            message:"role is not matching "
        })

    }
}
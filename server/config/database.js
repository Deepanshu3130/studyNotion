const mongoose = require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.Database_url ,{
        useNewUrlParser:true,
        useUnifiedTopology:true

    })
    .then(()=> console.log("db connection is successfully done"))
    .catch((err) =>{
        console.log("error in dbConnection")
        console.error(err.message);
        process.exit(1)
    } )
}

// const nodemailer = require("nodemailer");

// const mailSender = async(email , title , body ) =>{
//     try{
//         let transporter = nodemailer.createTransport({
//             host:process.env.MAIL_HOST,
//             auth:{
//                 user:process.env.MAIL_USER,
//                 pass:process.env.MAIL_PASS,
//             }
//         })
//         let info= await transporter.sendMail({
//             from:`StudyNotion||DEEPANSHU JOSHI`,
//             to:`${email}`,
//             subject:`${title}`,
//             html: `${body}`

//         })
//         console.log(info);
//         return info;
//     }
//     catch(error){
//         console.log(error)
//     }
// }
// module.exports=mailSender 

const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    console.log("Creating transporter...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log("Verifying SMTP connection...");
    await transporter.verify();

    console.log("SMTP verified");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("MAIL ERROR:", error);
    throw error;
  }
};

module.exports = mailSender;

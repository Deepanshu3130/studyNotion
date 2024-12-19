 const express = require("express")
 const router = express.Router()

const { capturePayment, verifyPayment ,sendVerificationMail } = require("../Controllers/payment")
 const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
 router.post("/capturePayment", auth, isStudent, capturePayment)
 router.post("/verifyPayment",auth, isStudent, verifyPayment)
 router.post("/sendVerificationMail", auth, isStudent, sendVerificationMail);

 module.exports = router
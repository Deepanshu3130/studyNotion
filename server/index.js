const express = require("express");
const app= express();

const userRoutes= require("./Routes/User");
const profileRoutes= require("./Routes/Profile");
const paymentRoutes= require("./Routes/payment");
const contactUsRoute = require("./Routes/ContactUS");
const courseRoutes = require("./Routes/courses");
const connect= require("./config/database");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinay");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");



dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
connect.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
		maxAge: 14400,
		allowedHeaders: ['Authorization', 'Content-Type'],
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
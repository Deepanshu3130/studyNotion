import { studentEndpoints } from "../api";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import rzplogo from "../../assets/Logo/rzp_logo.png";
//import { verifyPayment } from "../../../server/Controllers/payment";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

const loadScript = (src)=>{
    return new Promise((resolve)=>{
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script)
    });

}

export async function buyCourse(token , courses , userDetails , navigate , dispatch) {
    const toastId = toast.loading("Please wait while we redirect you to payment gateway ")
    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js" );
        if(!res){
            toast.error("Razorpay sdk failed to load . Are you online");
                return
            
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API , {courses, token},
           { Authorization: `Bearer ${token}`}
        )
        if(!orderResponse.data.sucess){
            toast.error(orderResponse.data.message)
            console.log("buyCourse -> orderResponse", orderResponse)
            toast.dismiss(toastId);
            return
        }
        console.log("buy-> courses0" , orderResponse);
        //console.log("printing the options")
        const options={
           key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        currency: orderResponse.data.message.currency,
        amount: orderResponse.data.message.amount.toString(),
        order_id: orderResponse.data.message.id,
        name: "Study Notion",
        description: "Thank you for purchasing the course",
        image: rzplogo,
        prefill: {
            name: userDetails?.firstName + " " + userDetails?.lastName,
            email: userDetails?.email,
        },
        handler:async function (response){
            console.log("buycourses -> response" , response)
            sendPaymentSuccessEmail(response , orderResponse.data.message.amount,token );
            verifyPayment(response,courses,token,navigate,dispatch);
        },
       
        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {  //see this line
            toast.error("Payment Failed");
        });
        toast.dismiss(toastId);
    
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Something went wrong");
            console.log("buyCourse -> error", error)
        }

    
}


async function sendPaymentSuccessEmail (response,amount,token) {
    // const data = {
    //     amount,
    //     paymentId: response.razorpay_payment_id,
    //     orderId: response.razorpay_order_id,
    //     signature: response.razorpay_signature,
    // };
    const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,{
        amount,
        paymentId:response.razorpay_payment_id,
        orderId:response.razorpay_order_id,
        token,
    }, {
        Authorisation: `Bearer ${token}`,
    });
    if (!res.success) {
        console.log(res.message);
        toast.error(res.message);
    }
}

async function verifyPayment(response,courses,token,navigate,dispatch){
    const toastId = toast.loading("please wait while we verify your payment")
    try{
        const res = await apiConnector("POST", COURSE_VERIFY_API,{
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courses:courses.courses || courses,
            //razorpay_signature: process.env.RAZORPAY_SECRET,
            token
        }, {
            Authorisation: `Bearer ${token}`,
        });
        console.log("verifypament -> res", res)
        if (!res.data.success) {
            toast.error(res.message);
            return;
        }

        toast.success("Payment Successfull");
        console.log(res.data)
        navigate("/dashboard/enrolled-courses");
        // dispatch(resetCart());
    }

    catch(err){
        toast.error("Payment Failed");
        console.log(err);
    }
    toast.dismiss(toastId);

}
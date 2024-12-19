import "./App.css";
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home";
import Navbar from "./component/common/Navbar";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgetPass from "./pages/ForgetPass";
import UpdatePassword from "./pages/UpdatePassword";
import Verifymail from "./pages/Verifymail";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import PrivateRoute from "./component/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Profile from "./component/core/Dashbord/Profile";
import Settings from "./component/core/Dashbord/Settings";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { checkSessionExpiration } from "./services/operations/authApi";
import { useSelector } from "react-redux";
import AddCourse from "./component/core/Dashbord/AddCourse";
import {ACCOUNT_TYPE} from "./component/utils/constants"
import Cart from "./component/core/Dashbord/Cart";
import EnrolledCourses from "./component/core/Dashbord/EnrolledCourses";
import MyCourses from "./component/core/Dashbord/MyCourses/MyCourses";
import Catalog from "./pages/Catalog";
import OpenRoute from "./component/core/auth/OpenRoute";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./component/core/viewcourse/VideoDetails";

function App() {
  const navigate= useNavigate();
  useEffect(()=>{
    checkSessionExpiration(navigate);
  },[]);


  const {user} = useSelector((state)=> state.profile);
  console.log("user is ", user)
  

  
    return(
        <div>
       
          <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
          <Navbar></Navbar>
            <Routes>
            
                <Route path ="/" element={<Home/>} />
                {/* <Route path="login" element={<Login/>}></Route>
                <Route path="signup" element={<Signup/>}></Route> */}
                <Route path="forgot-password" element={<ForgetPass></ForgetPass>}></Route>
                <Route path="/update-password/:id" element={<UpdatePassword/>}></Route>
                <Route path="verify-email" element={<Verifymail/>}></Route>
                <Route path="/about" element={<About/>}> </Route>
                <Route path="/contact" element={<ContactUs/>}></Route>
                <Route path="/catalog/:catalog" element={<Catalog />} />
                <Route path="courses/:courseId" element={<CourseDetails></CourseDetails>}></Route>
                <Route path="/courses/:courseId" element={<CourseDetails/>}></Route>
                <Route path="login" element={
                  <OpenRoute>
                    <Login></Login>
                  </OpenRoute>
                }></Route>

                <Route path="signup" element={
                  <OpenRoute>
                    <Signup/>
                  </OpenRoute>
                }></Route>

                <Route 
                 element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  >
                    <Route path="dashboard/my-profile" element={<Profile />} />
                    
                    <Route path="dashboard/settings" element={<Settings />} />
                    {
                      user?.accountType === ACCOUNT_TYPE.STUDENT && (
                        <>
                        <Route path="dashboard/cart" element={<Cart />} />
                        <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                        </>
                      )
                    }

                    {
                      user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                        <>
                        {/* //<Route path="dashboard/instructor" element={<Instructor />} /> */}
                        <Route path="dashboard/add-course" element={<AddCourse />} />
                         <Route path="dashboard/my-courses" element={<MyCourses />} />
                       {/* <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} /> */}
                        
                        </>
                      )
                    }
                                
                 </Route>


                 <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>
    </Routes>

          </div>
        

        </div>
    )
        
    
  
}

export default App;


//pending => protected routes in both the forms
//after all work done see the functionality of openroutes too
// look into the overflow in the pages and check wheather font and styling are applied or not

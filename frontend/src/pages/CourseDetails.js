import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { FaShareSquare, FaChevronDown } from 'react-icons/fa';
import { IoVideocamOutline } from 'react-icons/io5';
import { fetchCourseDetails } from '../services/operations/courseDetailsApi';
import { ACCOUNT_TYPE } from '../component/utils/constants';
import { buyCourse } from "../services/operations/studentsFeaturesApi"
import { addToCart } from '../slices/cartSlice';

const CourseDetails = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { cart } = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId } = useParams();

    const [courseDetail, setCourseDetail] = useState(null);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

    const handelPayment = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        const getCourseDetails = async () => {
            const response = await fetchCourseDetails(courseId, dispatch);
            if (response.length > 0) {
                setCourseDetail(response[0]);
            }
        };
        getCourseDetails();
    }, [courseId, dispatch]);

    useEffect(() => {
        if (courseDetail) {
            const Enrolled = courseDetail?.studentsEnrolled?.find((student) => student === user?._id);
            if (Enrolled) {
                setAlreadyEnrolled(true);
            }
        }
    }, [courseDetail, user?._id]);

    const handelAddToCart = () => {
        if (token) {
            dispatch(addToCart(courseDetail));
        }
        else {
            navigate('/login');
        }
    }

    if (!courseDetail) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='custom-loader'></div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-hidden mt-16 lg:mt-8 bg-richblack-900 text-richblack-5">
            {/* Mobile Thumbnail */}
            <div className='relative block w-full lg:hidden'>
                <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'></div>
                <img 
                    src={courseDetail?.thumbnail} 
                    alt="course thumbnail" 
                    className='w-full h-auto max-h-[30rem] object-cover'
                />
            </div>

            {/* Main Content Container */}
            <div className='mx-auto box-content px-4 max-w-[1260px] lg:relative'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Left Content - Course Info */}
                    <div className='w-full lg:w-2/3'>
                        <div className='py-8 lg:py-0'>
                            <h1 className='text-3xl sm:text-4xl font-bold text-yellow-200'>
                                {courseDetail?.courseName}
                            </h1>
                            <p className='mt-4 text-richblack-200'>
                                {courseDetail?.courseDescription}
                            </p>
                            
                            <div className='mt-6 flex flex-wrap items-center gap-4'>
                                <span className='text-richblack-200'>
                                    {courseDetail?.studentsEnrolled?.length} students enrolled
                                </span>
                                <div className='flex items-center gap-2 text-richblack-200'>
                                    <BsGlobe className='text-lg' />
                                    <span>English</span>
                                </div>
                            </div>

                            <div className='mt-4'>
                                <p className='text-richblack-50'>
                                    Created by {courseDetail?.instructor?.firstName} {courseDetail?.instructor?.lastName}
                                </p>
                                <p className='mt-2 flex items-center gap-2 text-richblack-50'>
                                    <AiOutlineInfoCircle className='text-lg' />
                                    Created at {new Date(courseDetail?.createdAt || courseDetail?.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* What You'll Learn Section */}
                        <div className='my-8 border border-richblack-600 p-4 sm:p-8 rounded-lg'>
                            <h2 className='text-2xl text-yellow-200 sm:text-3xl font-semibold mb-4'>What you'll learn</h2>
                            <div className='text-richblack-50'>
                                {courseDetail?.whatYouWillLearn || "Content not available"}
                            </div>
                        </div>

                        {/* Course Content Section */}
                        <div className='mb-10'>
                            <h2 className='text-2xl sm:text-3xl text-yellow-200 font-semibold mb-4'>Course Content</h2>
                            <div className='flex flex-wrap justify-between gap-2 mb-4'>
                                <div className='flex gap-2 text-richblack-50'>
                                    <span>{courseDetail?.courseContent?.length} Section(s)</span>
                                    <span>{courseDetail?.courseContent?.reduce((acc, item) => acc + item?.subSection?.length, 0)} Lecture(s)</span>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                {courseDetail?.courseContent?.map((item, index) => (
                                    <details key={index} className='border border-richblack-600 bg-richblack-700 rounded-lg overflow-hidden'>
                                        <summary className='flex cursor-pointer items-center justify-between p-4 sm:p-6'>
                                            <div className='flex items-center gap-3'>
                                                <FaChevronDown className='arrow text-sm' />
                                                <span className='text-lg font-medium'>{item?.sectionName}</span>
                                            </div>
                                            <span className='text-yellow-25 text-sm sm:text-base'>
                                                {item?.subSection?.length} Lecture(s)
                                            </span>
                                        </summary>
                                        <div className='mt-1'>
                                            {item?.subSection?.map((subItem, subIndex) => (
                                                <div key={subIndex} className='relative bg-richblack-900 p-4 border-t border-richblack-600'>
                                                    <div className='flex items-center gap-3'>
                                                        <IoVideocamOutline className='text-lg flex-shrink-0' />
                                                        <span className='text-richblack-5'>{subItem?.title}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>

                        {/* Author Section */}
                        <div className='mb-10'>
                            <h2 className='text-2xl sm:text-3xl font-semibold mb-4'>Author</h2>
                            <div className='flex items-center gap-4'>
                                <img 
                                    src={courseDetail?.instructor?.image} 
                                    alt="author" 
                                    className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover'
                                />
                                <div>
                                    <p className='text-lg sm:text-xl font-semibold'>
                                        {courseDetail?.instructor?.firstName} {courseDetail?.instructor?.lastName}
                                    </p>
                                    <p className='text-richblack-200 text-sm mt-1'>
                                        {courseDetail?.instructor?.additionalDetails?.about}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Course Card */}
                    <div className='w-full lg:w-1/3 lg:sticky lg:top-24 lg:h-fit lg:mt-8'>
                        <div className='bg-richblack-700 rounded-xl overflow-hidden shadow-lg'>
                            <img 
                                src={courseDetail?.thumbnail} 
                                alt="course thumbnail" 
                                className='w-full h-48 sm:h-56 object-cover'
                            />
                            
                            <div className='p-4 sm:p-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <span className='text-2xl font-bold'>₹{courseDetail?.price}</span>
                                </div>

                                {ACCOUNT_TYPE.INSTRUCTOR !== user?.accountType && (
                                    <div className='space-y-3'>
                                        {alreadyEnrolled ? (
                                            <button 
                                                onClick={() => navigate("/dashboard/enrolled-courses")}
                                                className='w-full bg-yellow-50 text-richblack-900 py-2 px-4 rounded-lg font-medium hover:bg-yellow-100 transition-colors'
                                            >
                                                Go to Course
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handelPayment}
                                                className='w-full bg-yellow-50 text-richblack-900 py-2 px-4 rounded-lg font-medium hover:bg-yellow-100 transition-colors'
                                            >
                                                Buy Now
                                            </button>
                                        )}
                                        
                                        {!alreadyEnrolled && (
                                            cart?.find((item) => item._id === courseDetail._id) ? (
                                                <button 
                                                    onClick={() => navigate("/dashboard/cart")}
                                                    className='w-full bg-richblack-800 text-richblack-5 py-2 px-4 rounded-lg font-medium hover:bg-richblack-700 transition-colors'
                                                >
                                                    Go to Cart
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={handelAddToCart}
                                                    className='w-full bg-richblack-800 text-richblack-5 py-2 px-4 rounded-lg font-medium hover:bg-richblack-700 transition-colors'
                                                >
                                                    Add to Cart
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}

                                <div className='mt-6 text-center text-sm text-richblack-25'>
                                    <p>30-Day Money-Back Guarantee</p>
                                </div>

                                <div className='mt-6'>
                                    <h3 className='text-lg font-semibold mb-3'>This course includes:</h3>
                                    <ul className='space-y-2 text-sm text-caribbeangreen-100'>
                                        {JSON.parse(courseDetail?.instructions).map((item, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                <span>✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className='mt-6 text-center'>
                                    <button 
                                        className='mx-auto flex items-center gap-2 text-yellow-100 hover:text-yellow-50 transition-colors'
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('URL copied to clipboard');
                                        }}
                                    >
                                        <FaShareSquare className='text-lg' />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
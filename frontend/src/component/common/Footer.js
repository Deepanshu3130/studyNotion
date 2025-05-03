import insta from "../../assets/Images/instagram.png";
import x from "../../assets/Images/twitter-x.png";

const Footer = () => {
    return (
        <footer className="bg-richblack-800 text-richblack-5 py-12 px-6 border-t border-richblack-600">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand and Description */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold flex items-center text-white">
                        Study<span className="text-blue-200">Notion</span>
                        <span className="text-yellow-50">.</span>
                    </h2>
                    <p className="mt-4 text-sm text-richblack-200">
                        StudyNotion is your all-in-one learning platform that helps you track courses, 
                        manage your learning progress, and connect with instructors. 
                        Elevate your learning experience with us!
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold text-richblack-5">QUICK LINKS</h3>
                    <ul className="mt-4 space-y-3 text-sm text-richblack-200">
                        <li><a href="#" className="hover:text-yellow-50 transition-colors">Home</a></li>
                        <li><a href="/about" className="hover:text-yellow-50 transition-colors">About Us</a></li>
                        {/* <li><a href="/contact" className="hover:text-yellow-50 transition-colors">Courses</a></li> */}
                        <li><a href="/contact" className="hover:text-yellow-50 transition-colors">Contact</a></li>
                    </ul>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-lg font-bold text-richblack-5">CONNECT WITH US</h3>
                    <ul className="mt-4 space-y-3 text-sm text-richblack-200">
                        <li>+91 7983251322</li>
                        <li>deepanshujoshi199@gmail.com</li>
                        <li className="flex items-center gap-4 mt-4">
                            <a href="https://www.instagram.com/depanshuu_01/" className="hover:opacity-80 transition-opacity">
                                <img src={insta} alt="Instagram" width={24} />
                            </a>
                            <a  href="https://x.com/Deepanshu3130" className="hover:opacity-80 transition-opacity">
                                <div className="bg-white w-6 h-6 flex items-center justify-center rounded-sm">
                                    <img src={x} alt="Twitter" className="w-4" />
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Copyright and Policies */}
            <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-richblack-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-richblack-300">
                    <div>
                        © 2024 StudyNotion. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-yellow-50 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-yellow-50 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-yellow-50 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
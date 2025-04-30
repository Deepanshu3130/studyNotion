import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import ProfileDropDown from '../core/auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/api'
import { IoIosArrowDropdown } from 'react-icons/io'
import { fetchCourseCategories } from '../../services/operations/courseDetailsApi'

function Navbar() {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const [sublinks, setSublinks] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false)
  
  const fetchSublinks = async() => {
    try {
      const result = await fetchCourseCategories();
      setSublinks(result);
    } catch(error) {
      console.log("Could not fetch the categories", error)
    }
  }
  
  useEffect(() => {
    fetchSublinks()
  }, []);

  const matchRoute = (route) => {
    return matchPath({path: route}, location.pathname);
  }

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className='flex w-11/12 max-w-maxContent justify-between '>
        {/* Logo */}
        <Link to="/">
          <img src={logo} width={160} height={42} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 ">
          <ul className='flex gap-x-6 text-richblack-25'>
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div 
                    className='flex items-center group relative cursor-pointer'
                    onMouseEnter={() => setCatalogDropdownOpen(true)}
                    onMouseLeave={() => setCatalogDropdownOpen(false)}
                  >
                    <p>{link.title}</p>
                    <IoIosArrowDropdown className="text-richblack-25 ml-1" />
                    
                    {catalogDropdownOpen && (
                      <div className="absolute left-1/2 top-full z-50 w-[220px] -translate-x-1/2 mt-2 flex flex-col rounded-lg bg-white shadow-lg">
                        <div className="absolute top-[-10px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white z-[-1]"></div>
                        {sublinks.map((link, index) => (
                          <Link
                            key={index}
                            to={`/catalog/${link.name}`}
                            className="px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 hover:text-blue-600 transition-colors"
                            onClick={() => setCatalogDropdownOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to={link.path}>
                    <p className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          </div>

          {/* Desktop Auth/Cart Section */}
          <div className='flex items-center gap-4'>
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className='relative'>
                <AiOutlineShoppingCart className='fill-richblack-25 w-7 h-7'/>
                {totalItems > 0 && (
                  <span className='shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-richblack-900 rounded-full px-1 absolute -top-[2px] -right-[8px]'>
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token === null && (
              <>
                <Link to="/login">
                  <button className='border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded'>
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className='border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded'>
                    Sign up
                  </button>
                </Link>
              </>
            )}

            {token !== null && <ProfileDropDown />}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-richblack-25 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <AiOutlineClose className="w-6 h-6" />
          ) : (
            <AiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-richblack-800 z-50 border-b border-richblack-700">
          <ul className="flex flex-col text-richblack-25">

          {/* {token === null ? (
                <div className="flex flex-row gap-3 mt-3">
                  <Link 
                    to="/login" 
                    className="border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 rounded text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 rounded text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="border-b border-richblack-700 px-4" >
                  <div className='flex flex-row justify-between'> profile <span>
                  <ProfileDropDown onClick={() => setMobileMenuOpen(false)} />
                  </span></div>
                 
                </div>
              )} */}
            {NavbarLinks.map((link, index) => (
              <li key={index} className="border-b border-richblack-700">
                {link.title === "Catalog" ? (
                  <div className="relative">
                    <button 
                      className="w-full px-4 py-3 text-left flex justify-between items-center"
                      onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                    >
                      <span>{link.title}</span>
                      <IoIosArrowDropdown className={`transition-transform ${catalogDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {catalogDropdownOpen && (
                      <div className="bg-richblack-900 pl-6">
                        {sublinks.map((sublink, subIndex) => (
                          <Link
                            key={subIndex}
                            to={`/catalog/${sublink.name}`}
                            className="block px-4 py-2 text-richblack-25 hover:bg-richblack-700"
                            onClick={() => {
                              setCatalogDropdownOpen(false)
                              setMobileMenuOpen(false)
                            }}
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    to={link.path} 
                    className="block px-4 py-3 hover:bg-richblack-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}

            {/* Mobile Auth/Cart Section */}
            <div className="px-4 py-3 border-t border-richblack-700">
              {user && user?.accountType !== "Instructor" && (
                <Link 
                  to="/dashboard/cart" 
                  className="flex items-center gap-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AiOutlineShoppingCart className='fill-richblack-25 w-6 h-6'/>
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className='ml-auto shadow-sm shadow-black text-xs font-bold bg-yellow-100 text-richblack-900 rounded-full px-2 py-0.5'>
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              
            </div>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
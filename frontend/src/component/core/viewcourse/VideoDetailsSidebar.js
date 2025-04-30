import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'

function VideoDetailsSidebar({ setReviewModal }) {
  const { courseSectionData, completedLectures } = useSelector((state) => state.viewCourse)
  const { courseId, sectionId, subsectionId, courseTitle } = useParams()
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState("")
  const [videoActive, setVideoActive] = useState("")
  const [openSections, setOpenSections] = useState({})

  // Initialize all sections as open by default
  useEffect(() => {
    if (courseSectionData) {
      const initialOpenState = {}
      courseSectionData.forEach(section => {
        initialOpenState[section._id] = true
      })
      setOpenSections(initialOpenState)
    }
  }, [courseSectionData])

  // Set active section and subsection
  useEffect(() => {
    if (!courseSectionData) return
    
    const currentSectionIndex = courseSectionData.findIndex(
      (section) => section._id === sectionId
    )
    if (currentSectionIndex === -1) return

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (subSection) => subSection?._id === subsectionId
    )
    if (currentSubSectionIndex === -1) return

    const activeSubsectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex]._id
    setActiveStatus(courseSectionData[currentSectionIndex]._id)
    setVideoActive(activeSubsectionId)
    
    // Open the current section
    setOpenSections(prev => ({
      ...prev,
      [courseSectionData[currentSectionIndex]._id]: true
    }))
  }, [courseSectionData, sectionId, subsectionId])

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <div className="flex h-full flex-col border-r border-richblack-700 bg-richblack-800 md:w-[320px]">
      {/* Header */}
      <div className="flex items-center gap-5 border-b border-richblack-600 p-4">
        <button
          onClick={() => navigate('/dashboard/enrolled-courses')}
          className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
        >
          <FaChevronLeft className="cursor-pointer" />
        </button>
        <div className="flex flex-col">
          <p className="font-extrabold text-yellow-200 text-lg">{courseTitle}</p>
          {/* <p className="text-xs text-richblack-200">
            {completedLectures?.length || 0} of {courseSectionData?.reduce((total, section) => total + section.subSection.length, 0) || 0} Lectures Completed
          </p> */}
        </div>
      </div>

      {/* Course Sections */}
      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {courseSectionData?.map((section) => (
          <div key={section._id} className="border-b border-richblack-600">
            {/* Section Header */}
            <div
              className={`flex cursor-pointer justify-between p-4 transition-all ${
                openSections[section._id] ? 'bg-richblack-700' : 'bg-richblack-800'
              }`}
              onClick={() => toggleSection(section._id)}
            >
              <p className="font-medium text-richblack-5">{section.sectionName}</p>
              {openSections[section._id] ? (
                <MdOutlineKeyboardArrowUp className="text-lg text-richblack-300" />
              ) : (
                <MdOutlineKeyboardArrowDown className="text-lg text-richblack-300" />
              )}
            </div>

            {/* SubSections */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openSections[section._id] ? 'max-h-[1000px]' : 'max-h-0'
              }`}
            >
              {section.subSection.map((subSection) => (
                <div
                  key={subSection._id}
                  onClick={() => {
                    navigate(
                      `/dashboard/enrolled-courses/view-course/${courseId}/section/${section._id}/sub-section/${subSection._id}`
                    )
                  }}
                  className={`flex cursor-pointer items-center justify-between p-3 pl-6 transition-all ${
                    subSection._id === videoActive
                      ? 'bg-yellow-100 text-richblack-900'
                      : 'bg-richblack-800 text-richblack-5 hover:bg-richblack-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* <input
                      type="checkbox"
                      checked={completedLectures?.includes(subSection._id)}
                      onChange={(e) => e.stopPropagation()} // Prevent navigation when clicking checkbox
                      onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                      className="h-4 w-4 rounded border-richblack-300 text-yellow-50 focus:ring-yellow-50"
                    /> */}
                    <p className="text-sm font-medium">{subSection.title}</p>
                  </div>
                  {subSection._id === videoActive && (
                    <FaAngleDoubleRight className="text-richblack-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoDetailsSidebar
import React, { useState, useEffect } from 'react';
import { FaDesktop, FaTimes } from 'react-icons/fa';

const DesktopModeModal = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user is on mobile device
    const checkIfMobile = () => {
      const mobileBreakpoint = 768;
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(mobile || window.innerWidth < mobileBreakpoint);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Show modal only once per session
    const modalShown = sessionStorage.getItem('desktopModeModalShown');
    if (isMobile && !modalShown) {
      setShowModal(true);
      sessionStorage.setItem('desktopModeModalShown', 'true');
    }

    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobile]);

  const openInDesktopMode = () => {
    const url = window.location.href;
    window.open(url, '_blank');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
      <div className="bg-richblack-800 text-richblack-5 rounded-lg max-w-md w-full p-6 relative border border-richblack-600">
        <button 
          onClick={closeModal}
          className="absolute top-3 right-3 text-richblack-400 hover:text-richblack-5 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-richblack-700 mb-4 text-yellow-50">
            <FaDesktop className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-richblack-5 mb-2">
            Better Experience on Desktop
          </h3>
          <div className="mt-2 text-sm text-richblack-200">
            <p>
              For the best learning experience, we recommend viewing this platform on a desktop computer.
            </p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* <button
              type="button"
              onClick={openInDesktopMode}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-richblack-900 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <FaDesktop className="mr-2" />
              Open in Desktop Mode
            </button> */}
            <button
              type="button"
              onClick={closeModal}
              className="w-full px-4 py-2 border border-richblack-600 rounded-md shadow-sm text-sm font-medium text-richblack-5 bg-richblack-700 hover:bg-richblack-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-richblack-500 transition-colors"
            >
              Continue on Mobile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopModeModal;
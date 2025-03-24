import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ isScrolled, onLogin, onSignup }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1
              className={`text-2xl font-bold ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              SmartServe
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {["Features", "About", "Services", "Gallery", "Testimonials", "Team", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`${
                      isScrolled
                        ? "text-gray-900 hover:text-gray-700"
                        : "text-white hover:text-gray-300"
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    {item}
                  </a>
                )
              )}
              {/* Login & Signup Buttons */}
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${
                isScrolled ? "text-gray-900" : "text-white"
              } hover:text-gray-500 inline-flex items-center justify-center p-2 rounded-md focus:outline-none`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 w-full shadow-md">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {["Features", "About", "Services", "Gallery", "Testimonials", "Team", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              )
            )}
            {/* Login & Signup Buttons for Mobile */}
            <button
              onClick={() => {
                setIsOpen(false);
                onLogin();
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onSignup();
              }}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

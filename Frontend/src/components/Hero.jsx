import React from "react";
import { ChevronRight } from "lucide-react";

const Hero = ({ onLogin }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-screen">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Hero background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Your Trusted Partner</span>
              <span className="block text-blue-200">for Hassle-Free Services</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Revolutionizing Service Management with Smart Technology
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              {/* Updated Button to Open Login */}
              <button
                onClick={onLogin}
                className="group relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-100 bg-blue-800 hover:bg-blue-900"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-current text-white" viewBox="0 0 1440 74" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C240,70 480,70 720,35 C960,0 1200,0 1440,35 L1440 74 L0 74 Z" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;

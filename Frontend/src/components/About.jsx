import React from 'react';
import { ArrowRight, Target, Users, TrendingUp, Award } from 'lucide-react';
import { FaArrowRightLong } from "react-icons/fa6";

const AboutPage = () => {
  return (
    <div id='about' className='bg-gray-50 '>
      {/* Hero Section */}
      <section className="bg-gradient-to-r  text-black py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              About SmartServe
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Revolutionizing the way clients connect with service providers through innovative technology.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-4 text-lg text-gray-600">
            SmartServe was born from a simple observation: finding reliable service providers is unnecessarily difficult, pricing lacks transparency, and the entire process is filled with inefficiencies.

We set out to create a platform that would revolutionize service management by connecting clients with verified professionals through cutting-edge technology, ensuring transparency, accountability, and seamless experiences for everyone involved.
            </p>
          </div>
          <a href='#features'>
          <div className='flex flex-row text-blue-600 gap-4 items-center cursor-pointer'>
            <p>Explore Our Fetures</p>
            <FaArrowRightLong />
          </div>
          </a>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">Our Core Values</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <Target className="h-12 w-12 text-indigo-600 mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Customer Focus</h3>
              <p className="text-gray-600 mt-2">
                We prioritize our users by offering seamless and secure service connections.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <Users className="h-12 w-12 text-indigo-600 mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Community Building</h3>
              <p className="text-gray-600 mt-2">
                Our goal is to build a strong network of professionals and clients.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <TrendingUp className="h-12 w-12 text-indigo-600 mx-auto" />
              <h3 className="text-xl font-semibold mt-4">Innovation</h3>
              <p className="text-gray-600 mt-2">
                We continuously innovate to enhance service tracking and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose SmartServe?</h2>
            <p className="mt-4 text-lg text-gray-600">
              We are committed to making service tracking more transparent, efficient, and accessible for everyone.
            </p>
          </div>
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-8">
            <div className="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg">
              <Award className="h-10 w-10 text-indigo-600 mr-4" />
              <p className="text-lg text-gray-700">Trusted by Thousands</p>
            </div>
            <div className="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg">
              <ArrowRight className="h-10 w-10 text-indigo-600 mr-4" />
              <p className="text-lg text-gray-700">Seamless Service Matching</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

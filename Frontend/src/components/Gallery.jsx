import React, { useState } from "react";
import { X } from "lucide-react";

// Importing local images correctly
import img1 from "../img/carpenter.jpg";
import img2 from "../img/carwash.jpg";
import img3 from "../img/computer.jpg";
import img4 from "../img/electrician.jpg";
import img5 from "../img/painter.jpg";
import img6 from "../img/mechanic.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const projects = [
    { image: img1, title: "Carpentry Services", category: "Home Improvement" },
    { image: img2, title: "Car Wash & Detailing", category: "Automotive Services" },
    { image: img3, title: "Computer Repairs", category: "Tech Support" },
    { image: img4, title: "Electrical Installations", category: "Home Services" },
    { image: img5, title: "Painting & Decorating", category: "Interior Design" },
    { image: img6, title: "Mechanic Services", category: "Vehicle Maintenance" },
  ];

  return (
    <section id="gallery" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Gallery</h2>
          <p className="mt-4 text-xl text-gray-600">Showcasing our Most Demanding Services</p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
              onClick={() => setSelectedImage(project.image)}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover object-top w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-300 mt-2">{project.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Ensure image is cropped from the bottom */}
          <div className="max-w-4xl w-full max-h-screen flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Selected project"
              className="w-auto h-auto max-h-[90vh] max-w-full object-cover object-top rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;

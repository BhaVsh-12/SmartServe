import React from "react";
import { 
  Home, Wrench, Tv, Wifi, Shield, Settings, Laptop, Smartphone, Database, 
  Dumbbell, HeartPulse, Car, Briefcase, BookOpen, Scissors, Camera 
} from "lucide-react";


const Services = () => {
  const serviceTypes = [
    {
      category: "Home Services",
      services: [
        { icon: <Wrench className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Plumbing", description: "Reliable plumbing services for repairs and installations." },
        { icon: <Home className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Cleaning", description: "Professional cleaning services for your home." },
        { icon: <Settings className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Painting", description: "High-quality painting services for homes and offices." }
      ]
    },
    {
      category: "Tech Services",
      services: [
        { icon: <Laptop className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "IT Support", description: "Comprehensive IT support for businesses and individuals." },
        { icon: <Database className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Software Development", description: "Custom software solutions for your needs." },
        { icon: <Wifi className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Networking", description: "Reliable networking solutions for homes and offices." }

      ]
    },
    {
      category: "Health & Wellness",
      services: [
        { icon: <Dumbbell className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Fitness Training", description: "Personalized fitness programs and training." },
        { icon: <HeartPulse className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Mental Health Counseling", description: "Professional support for mental well-being." },
        { icon: <Shield className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Physiotherapy", description: "Rehabilitation and therapy for physical conditions." }
      ]
    },
    
    {
      category: "Business & Finance Services",
      services: [
        { icon: <Briefcase className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Accounting", description: "Expert accounting and bookkeeping services." },
        { icon: <Briefcase className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Tax Preparation", description: "Comprehensive tax filing and planning." },
        { icon: <Briefcase className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Business Strategy", description: "Strategic consulting for business growth." }
      ]
    },
    
    {
      category: "Beauty & Personal Care",
      services: [
        { icon: <Scissors className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Hair Styling", description: "Professional haircuts and styling services." },
        { icon: <Scissors className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Makeup", description: "Expert makeup services for any occasion." },
        { icon: <Scissors className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Spa Treatments", description: "Relaxing spa and wellness therapies." }
      ]
    },
    {
      category: "Event & Entertainment Services",
      services: [
        { icon: <Camera className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Photography", description: "Professional photography and videography services." },
        { icon: <Camera className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Catering", description: "Delicious catering for all events." },
        { icon: <Camera className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />, title: "Wedding Planning", description: "Expert planning for your special day." }
      ]
    }
  ];

  return (
    <section id="services" className="section-padding bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Comprehensive solutions for your service tracking needs</p>
        </div>
        {serviceTypes.map((type, index) => (
          <div key={index} className="mb-12">
            <h3 className="text-3xl font-semibold text-blue-600 mb-6 border-b-2 border-blue-500 pb-2">{type.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {type.services.map((service, idx) => (
                <div
                  key={idx}
                  className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-500 hover:scale-105"
                  onClick={()=>(alert("Login to access this feature"))}
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;

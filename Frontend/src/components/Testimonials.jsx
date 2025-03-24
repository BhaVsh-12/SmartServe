import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Das",
    role: "Client",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    content:
      "Booking a service is super easy! I can compare ratings, check prices, and even chat with the service provider before confirming. No more guessing if the person is reliable!",
    rating: 5,
  },
  {
    name: "Vinay Tayade",
    role: "Plumber (ServiceMan)",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    content:
      "I used to struggle with finding new customers, but this app connects me directly with clients who need my services. It’s like having a personal marketing team!",
    rating: 5,
  },
  {
    name: "Arjun Maharaj",
    role: "Client",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    content:
      "The real-time tracking helps me plan my day better. I can see exactly when the technician is arriving instead of waiting around.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-white ">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Don't just take our word for it
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 relative hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-500"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md transition-transform transform hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                />
              </div>
              <div className="pt-10 text-center">
                <div className="flex justify-center mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm md:text-base italic">{testimonial.content}</p>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

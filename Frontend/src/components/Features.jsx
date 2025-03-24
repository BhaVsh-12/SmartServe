import React from 'react';
import { 
  Search, Star, MessageCircle, MapPin, CreditCard, Clock, 
  UserCheck, Settings, FileText, Briefcase, DollarSign
} from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div id='features' className='bg-white'>
      <section className="bg-gradient-to-r text-black py-16 m-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Powerful Features</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover the comprehensive set of tools designed to revolutionize service management.
          </p>
        </div>
      </section>

      {/* Features Sections */}
      {[
        {
          title: "For Clients",
          description: "Everything you need to find and manage professional services.",
          features: [
            { icon: <Search />, title: "Explore & Search", desc: "Find the perfect service provider with advanced filters." },
            { icon: <Star />, title: "Ratings & Feedback", desc: "Read and leave feedback after service completion." },
            { icon: <MessageCircle />, title: "Direct Chat", desc: "Communicate directly with service providers." },
            { icon: <MapPin />, title: "Real-time Tracking", desc: "Track your service provider's status." },
            { icon: <CreditCard />, title: "Secure Payments", desc: "Pay securely through our platform." },
            { icon: <Clock />, title: "Booking History", desc: "Manage your complete booking history." },
          ],
        },
        {
          title: "For Service Providers",
          description: "Tools to grow your business and manage clients efficiently.",
          features: [
            { icon: <UserCheck />, title: "Request Management", desc: "Manage service requests from a dashboard." },
            { icon: <Settings />, title: "Profile Customization", desc: "Showcase your services professionally." },
            { icon: <FileText />, title: "Feedback Management", desc: "View and respond to customer feedback." },
            { icon: <Briefcase />, title: "Membership Plans", desc: "Get enhanced visibility with plans." },
            { icon: <DollarSign />, title: "Secure Transactions", desc: "Receive secure payments." },
            { icon: <MessageCircle />, title: "Client Communication", desc: "Stay connected via messaging." },
          ],
        },
      ].map((section, index) => (
        <section key={index} className={`py-16 ${section.bgColor}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-500"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default FeaturesPage;

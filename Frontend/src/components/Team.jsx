import React from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";

const Team = () => {
  const team = [
    {
      name: "David Miller",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@example.com",
      },
    },
    {
      name: "Lisa Wang",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "lisa@example.com",
      },
    },
    {
      name: "James Wilson",
      role: "UX Designer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james@example.com",
      },
    },
    {
      name: "Sofia Martinez",
      role: "Project Manager",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sofia@example.com",
      },
    },
  ];

  return (
    <section id="team" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 text-xl text-gray-600">The people behind our success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4">
                    <a href={member.social.linkedin} className="text-white hover:text-blue-400 transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href={member.social.twitter} className="text-white hover:text-blue-400 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href={`mailto:${member.social.email}`} className="text-white hover:text-blue-400 transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 mt-2">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

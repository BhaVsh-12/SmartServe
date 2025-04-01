import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, MapPin, DollarSign, Clock, Briefcase, User2, Mail, Building, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from "../../Api/capi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = {
    'Home Services': ['Plumbing', 'Cleaning', 'Painting'],
    'Tech Services': ['IT-Support', 'Software-Development', 'Networking'],
    'Health & Wellness': ['Fitness-Training', 'Mental-Health-Counseling', 'Physiotherapy'],
    'Business & Finance Services': ['Accounting', 'Tax-Preparation', 'Business-Strategy'],
    'Beauty & Personal Care': ['Hair-Styling', 'Makeup', 'Spa=Treatments'],
    'Event & Entertainment Services': ['Photography', 'Catering', 'Wedding-Planning'],
    'Education & Coaching': ['Tutoring', 'Public-Speaking-Coaching', 'Skill-Development'],
    'Automobile Services': ['Car-Repair', 'Oil-Change', 'Battery-Service'],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      try {
        const response = await api.get("/serviceman/api/auth/getProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Profile Data:", response.data);
        setProfile(response.data);
      } catch (error) {
        toast.error(`Failed to load profile: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found in localStorage");
      toast.error("Session expired. Please log in again.");
      return;
    }

    let imageUrl = profile.profilePhoto;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);

      try {
        const uploadRes = await api.post(
          "/serviceman/api/auth/uploadPhoto",
          formData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadRes.data.imageUrl;
        console.log("✅ Uploaded Image URL:", imageUrl);
      } catch (error) {
        console.error("❌ Image Upload Failed:", error);
        toast.error("Failed to upload image.");
        return;
      }
    }

    try {
      const response = await api.put(
        "/serviceman/api/auth/updateProfile",
        {
          fullName: profile.fullName,
          serviceCategory: profile.serviceCategory,
          subCategory: profile.subCategory,
          availability: profile.availability,
          location: profile.location,
          price: profile.price,
          profilePhoto: imageUrl,
          description: profile.description,
          experience: profile.experience,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Profile Updated:", response.data);
      toast.success("Profile updated successfully!");
      setProfile((prev) => ({ ...prev, profilePhoto: imageUrl }));
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      toast.error("Failed to update profile.");
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  if (!profile) {
    return <div>Loading profile...</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Profile Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img
                  src={profile.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-500/20"
                />
                <button
                  className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors shadow-lg"
                  onClick={isEditing ? triggerFileInput : () => {}}
                >
                  <Camera size={20} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                  disabled={!isEditing}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{profile.fullName}</h2>
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
                <MapPin size={16} className="mr-1" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">{profile.price}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hourly Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {profile.availability ? "Available" : "Busy"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                </div>
              </div>
              <div className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-semibold mb-2">Service Category</h3>
                <p className="text-gray-600 dark:text-gray-400">{profile.serviceCategory}</p>
                <p className="text-sm text-primary-500 mt-1">{profile.subCategory}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Profile Details</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-lg border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {isEditing? 'Cancel'
                    : 'Edit Profile'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <User2 size={16} className="mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <Mail size={16} className="mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled={true}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <MapPin size={16} className="mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <Briefcase size={16} className="mr-2" />
                    Service Category
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.serviceCategory}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          serviceCategory: e.target.value,
                          subCategory: categories[e.target.value][0],
                        });
                      }}
                      className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                    >
                      {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={profile.serviceCategory}
                      disabled={true}
                      className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <Building size={16} className="mr-2" />
                    Sub Category
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.subCategory}
                      onChange={(e) => setProfile({ ...profile, subCategory: e.target.value })}
                      className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                    >
                      {categories[profile.serviceCategory]?.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={profile.subCategory}
                      disabled={true}
                      className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <DollarSign size={16} className="mr-2" />
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    value={profile.price}
                    onChange={(e) => setProfile({ ...profile, price: Number(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <Clock size={16} className="mr-2" />
                    Availability
                  </label>
                  <select
                    value={profile.availability ? "true" : "false"}
                    onChange={(e) => setProfile({ ...profile, availability: e.target.value === "true" })}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <FileText size={16} className="mr-2" />
                    Description
                  </label>
                  <textarea
                    value={profile.description || ""}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    <Star size={16} className="mr-2" />
                    Experience
                  </label>
                  <input
                    type="text"
                    value={profile.experience || ""}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
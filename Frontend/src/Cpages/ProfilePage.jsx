import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit2,
  Check,
  X,
  MapPin,
  Mail,
  Camera,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://smartserve-z2ms.onrender.com/user/api/auth/getProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
        setEditedProfile({ ...response.data });
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load profile.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    let imageUrl = editedProfile.profilePhoto;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);

      try {
        const uploadRes = await axios.post(
          "https://smartserve-z2ms.onrender.com/user/api/auth/uploadPhoto",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageUrl = uploadRes.data.imageUrl;
      } catch (error) {
        toast.error("Failed to upload image.");
        return;
      }
    }

    try {
      const response = await axios.put(
        "https://smartserve-z2ms.onrender.com/user/api/auth/updateProfile",
        {
          fullName: editedProfile.fullName,
          location: editedProfile.location,
          profilePhoto: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
      setProfile((prev) => ({
        ...prev,
        profilePhoto: imageUrl,
        fullName: editedProfile.fullName,
        location: editedProfile.location,
      }));
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center p-4">Profile not found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Your Profile
      </h2>

      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <img
            src={editedProfile.profilePhoto}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-primary-200 shadow-md"
          />
          {editMode && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors shadow-md"
              onClick={triggerFileInput}
            >
              <Camera size={20} />
            </motion.button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
            disabled={!editMode}
          />
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="border rounded-md p-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="h-5 w-5" />
            <label className="font-semibold">Full Name:</label>
          </div>
          <input
            type="text"
            name="fullName"
            value={editedProfile.fullName}
            onChange={handleInputChange}
            disabled={!editMode}
            className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-primary-300 outline-none"
            placeholder="Full Name"
          />
        </div>

        <div className="border rounded-md p-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="h-5 w-5" />
            <label className="font-semibold">Location:</label>
          </div>
          <input
            type="text"
            name="location"
            value={editedProfile.location}
            onChange={handleInputChange}
            disabled={!editMode}
            className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-primary-300 outline-none"
            placeholder="Location"
          />
        </div>

        <div className="border rounded-md p-3 bg-gray-50">
          <div className="flex items-center space-x-2 text-gray-700">
            <Mail className="h-5 w-5" />
            <label className="font-semibold">Email:</label>
          </div>
          <input
            type="email"
            name="email"
            value={editedProfile.email}
            disabled={true}
            className="mt-1 w-full border rounded-md p-2 bg-transparent outline-none"
            placeholder="Email"
          />
        </div>

        <div className="flex justify-center mt-4">
          <AnimatePresence>
            {editMode ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-green-500 text-white p-2 rounded-md shadow-md"
                  onClick={handleSave}
                >
                  <Save className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-500 text-white p-2 rounded-md shadow-md"
                  onClick={() => {
                    setEditMode(false);
                    setEditedProfile({ ...profile });
                  }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-blue-500 text-white p-2 rounded-md shadow-md"
                onClick={() => setEditMode(true)}
              >
                <Edit2 className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Api from "../Api/capi";
import toast from "react-hot-toast"; // Import toast

export default function Login({ onClose ,onSignup }) {
  const [userType, setUserType] = useState("client");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    if (name === "email") return emailRegex.test(value) ? "" : "Invalid email format";
    if (name === "password") return value.length >= 8 ? "" : "Password must be at least 8 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
  };
  const openSignup =()=>{
    onClose();
    onSignup();

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.email || errors.password) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = userType === "client" ? "/user/api/auth/login" : "/serviceman/api/auth/login";

      const { data } = await Api.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", userType);

      toast.success("Login successful!");
      navigate(userType === "client" ? "/client/explore" : "/service");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
      <div className="relative w-full max-w-sm p-6 rounded-lg shadow-lg bg-white border border-gray-300 
                    md:absolute md:right-0 md:top-[40%] md:-translate-y-1/2">
        <button
          className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {/* User Type Selection */}
        <div className="flex justify-center space-x-4 mb-4">
          {["client", "service"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md ${userType === type ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setUserType(type)}
            >
              {type === "client" ? "Client" : "Service Provider"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"}`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isSubmitting || !!errors.email || !!errors.password}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <button className="text-blue-600 hover:underline" onClick={openSignup}>
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}
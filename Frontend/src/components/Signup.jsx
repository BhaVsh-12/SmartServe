import { useState } from "react";
import { X } from "lucide-react";
import Api from "../Api/capi";
import toast from "react-hot-toast"; // Import toast

export default function Signup({ onClose ,Login}) {
  const [userType, setUserType] = useState("client");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    if (name === "email") return emailRegex.test(value) ? "" : "Invalid email format";
    if (name === "password") return value.length >= 8 ? "" : "Password must be at least 8 characters";
    if (name === "confirmPassword") return value === formData.password ? "" : "Passwords do not match";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
  };
  const openLogin =()=>{
    onClose();
    Login();

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.email || errors.password || errors.confirmPassword) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = userType === "client" ? "/user/api/auth/signup" : "/serviceman/api/auth/signup";

      const { data } = await Api.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Signup successful!"); // Use toast for success
      onClose();
    } catch (error) {
      console.error("Signup Error:", error);
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage); // Use toast for error
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

        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

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

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isSubmitting || !!errors.email || !!errors.password || !!errors.confirmPassword}
          >
            {isSubmitting ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button className="text-blue-600 hover:underline" onClick={openLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
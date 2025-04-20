import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // Reusing logo from Home component

const SignupOwner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for parallax effects
  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "confirmPassword") {
      setPasswordMatch(formData.password === value);
    } else if (name === "password") {
      setPasswordMatch(formData.confirmPassword === "" || value === formData.confirmPassword);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // Preparing data to match your Spring Boot `Owners` model
    const ownerData = {
      owner_name: formData.name,
      email: formData.email,
      mobile_number: formData.phone,
      address: formData.address,
      password: formData.password,
    };
  
    try {
      const response = await fetch("http://localhost:8080/SignUp/Owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ownerData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("User", JSON.stringify(responseData));
        alert("Signup Successful!");
        navigate("/owner-dashboard");
      } else {
        const errorMessage = await response.text();
        alert(errorMessage || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error connecting to the server.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-stretch bg-[#190000] text-white relative overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Full-screen Background with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://source.unsplash.com/1920x1080/?luxury,mansion,interior')",
          transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px) scale(1.1)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#220000]/85 to-[#330000]/75"></div>
      </div>
      
      {/* Decorative Elements - Reduced quantity for vertical space */}
      <div className="absolute inset-0">
        {/* Golden Radial Gradient */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-[#D09683]/10 blur-3xl"></div>
        
        {/* Animated Particles - Reduced to 15 */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `rgba(${208 + Math.random() * 30}, ${150 + Math.random() * 30}, ${131 + Math.random() * 30}, ${Math.random() * 0.5 + 0.3})`,
              boxShadow: `0 0 ${Math.random() * 6 + 2}px rgba(${208}, ${150}, ${131}, 0.8)`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      
      {/* Main Layout - Compact */}
      <div className="flex flex-col w-full h-full z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center px-4 py-2"
        >
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Luxury Living Logo" className="w-8 h-8" />
            <h2 className="ml-2 text-xl font-light">
              <span className="font-bold text-[#D09683]">Luxury</span> Living
            </h2>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 border border-[#D09683] text-[#D09683] rounded-md hover:bg-[#D09683]/10 transition-colors text-sm"
            onClick={() => navigate("/")}
          >
            Back
          </motion.button>
        </motion.div>
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 px-4 py-2 flex justify-center overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/30 backdrop-filter backdrop-blur-md rounded-xl border border-white/10 p-5 w-full max-w-md self-center"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">🏛️</span>
              <h2 className="text-xl font-light">
                <span className="font-bold text-[#D09683]">Owner</span> Registration
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
              />

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Address"
                className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
              />

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                  className={`w-full p-2 rounded-lg text-black outline-none shadow-md focus:ring-2 transition text-sm
                    ${!passwordMatch && formData.confirmPassword !== "" ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D09683]"}`}
                />
                {!passwordMatch && formData.confirmPassword !== "" && (
                  <p className="absolute -bottom-5 left-0 text-red-400 text-xs">Passwords don't match</p>
                )}
              </div>
              
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#D09683] to-[#c88975] text-white font-bold text-sm rounded-lg shadow-lg transition-all transform"
                >
                  Create Account
                </motion.button>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-white/60 text-xs">
                  Already have an account?{" "}
                  <span 
                    className="text-[#D09683] cursor-pointer hover:underline"
                    onClick={() => navigate("/auth?role=owner")}
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Footer - Reduced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="py-2 px-4 text-center text-white/60 text-xs"
        >
          © 2025 Luxury Living. All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};

export default SignupOwner;
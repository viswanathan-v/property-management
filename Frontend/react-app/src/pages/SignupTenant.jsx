import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const SignupTenant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    family_count: "",
    aadhar_no: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      setPasswordMatch(formData.password === e.target.value || formData.confirmPassword === e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const tenantData = {
      tenant_name: formData.name,
      email: formData.email,
      mobile_number: formData.phone,
      family_count: formData.family_count,
      aadhar_no: formData.aadhar_no,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8080/SignUp/Tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tenantData),
      });

      if (response.ok) {
        localStorage.setItem("User", JSON.stringify(await response.json()));
        alert("SignUp Successful");
        navigate("/tenant-dashboard");
      } else {
        alert("Sign Up Failed!");
      }
    } catch (err) {
      console.error("Error Submitting form: ", err);
      alert("Error Connecting to the server.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-stretch bg-[#190000] text-white relative overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://source.unsplash.com/1920x1080/?luxury,apartment,interior')",
          transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px) scale(1.1)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#220000]/85 to-[#330000]/75"></div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col w-full h-full z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Luxury Living Logo" className="w-8 h-8" />
            <h2 className="ml-2 text-xl font-light">
              <span className="font-bold text-[#D09683]">Luxury</span> Living
            </h2>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 border border-[#D09683] text-[#D09683] rounded-md hover:bg-[#D09683]/10 transition-colors text-sm" onClick={() => navigate("/")}>
            Back
          </motion.button>
        </motion.div>

        {/* Form Section */}
        <div className="flex-1 px-4 py-2 flex justify-center overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-black/30 backdrop-filter backdrop-blur-md rounded-xl border border-white/10 p-5 w-full max-w-md self-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">🏠</span>
              <h2 className="text-xl font-light">
                <span className="font-bold text-[#D09683]">Tenant</span> Registration
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {["name", "phone", "email", "family_count", "aadhar_no"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
                />
              ))}

              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full p-2 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm" />

              <div className="relative">
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" className={`w-full p-2 rounded-lg text-black outline-none shadow-md focus:ring-2 transition text-sm ${!passwordMatch && formData.confirmPassword !== "" ? "border-red-500 focus:ring-red-500" : "focus:ring-[#D09683]"}`} />
                {!passwordMatch && formData.confirmPassword !== "" && <p className="absolute -bottom-5 left-0 text-red-400 text-xs">Passwords don't match</p>}
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="w-full py-2 bg-gradient-to-r from-[#D09683] to-[#c88975] text-white font-bold text-sm rounded-lg shadow-lg transition-all transform">
                Create Account
              </motion.button>

              {/* Already have an account? Login */}
              <div className="text-center pt-2">
                <p className="text-white/60 text-xs">
                  Already have an account?{" "}
                  <span 
                    className="text-[#D09683] cursor-pointer hover:underline"
                    onClick={() => navigate("/auth?role=tenant")}
                  >
                    Sign in
                  </span>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupTenant;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import logo from "../assets/logo.png"; // Reusing logo from Home component

const SignInSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/SignIn/${role}`, formData);
      localStorage.setItem("User", JSON.stringify(response.data));
      alert("Login successful!");
      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.role) localStorage.setItem("role",response.data.role);
      navigate(`/${role}-dashboard`);
    } catch (err) {
      alert(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  
  // Role icon mapping based on the home component
  const getRoleIcon = () => {
    switch(role) {
      case "owner": return "🏛️";
      case "vendor": return "🛠️";
      case "tenant": return "🏠";
      default: return "👤";
    }
  };
  
  return (
    <div className="h-screen w-screen flex items-stretch bg-[#190000] text-white relative overflow-hidden">
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
      
      {/* Decorative Elements - Reduced quantity for performance */}
      <div className="absolute inset-0">
        {/* Golden Radial Gradient */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-[#D09683]/10 blur-3xl"></div>
        
        {/* Animated Particles - Reduced to 20 */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 5 + 1}px`,
              height: `${Math.random() * 5 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `rgba(${208 + Math.random() * 30}, ${150 + Math.random() * 30}, ${131 + Math.random() * 30}, ${Math.random() * 0.5 + 0.3})`,
              boxShadow: `0 0 ${Math.random() * 8 + 2}px rgba(${208}, ${150}, ${131}, 0.8)`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      
      {/* Main Layout - More compact */}
      <div className="flex flex-col w-full h-full z-10">
        {/* Reduced Top Logo Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center px-6 py-3 lg:px-10 lg:py-4"
        >
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Luxury Living Logo" className="w-8 h-8 lg:w-10 lg:h-10" />
            <h2 className="ml-2 text-xl lg:text-2xl font-light">
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
        
        {/* Main Content - More compact */}
        <div className="flex flex-1 px-4 lg:px-10 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/30 backdrop-filter backdrop-blur-md rounded-xl border border-white/10 p-6 w-full max-w-md"
          >
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">{getRoleIcon()}</span>
              <h2 className="text-xl font-light">
                <span className="font-bold text-[#D09683]">{role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}</span> Access
              </h2>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-center text-white text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full p-3 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full p-3 rounded-lg text-black outline-none shadow-md bg-white/90 focus:ring-2 focus:ring-[#D09683] transition text-sm"
                />
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-1" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="text-[#D09683] hover:underline">Forgot password?</a>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#D09683] to-[#c88975] text-white font-bold text-sm rounded-lg shadow-lg transition-all transform"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In"}
              </motion.button>
            </form>
            
            {/* Divider */}
            <div className="my-4 flex items-center w-full">
              <div className="flex-grow h-px bg-white/20"></div>
              <span className="mx-2 text-white/60 font-medium text-xs">OR</span>
              <div className="flex-grow h-px bg-white/20"></div>
            </div>
            
            <div className="text-center">
              <p className="mb-2 text-white/70 text-xs">Don't have an account yet?</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/signup/${role}`)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-sm rounded-lg transition-all transform"
              >
                Create Account
              </motion.button>
            </div>
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

export default SignInSignUp;
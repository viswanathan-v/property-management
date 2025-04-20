import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
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

      {/* Decorative Elements */}
      <div className="absolute inset-0">
        {/* Golden Radial Gradient */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-[#D09683]/10 blur-3xl"></div>
        
        {/* Animated Particles */}
        {[...Array(50)].map((_, i) => (
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

      {/* Main Layout */}
      <div className="flex flex-col w-full h-full z-10">
        {/* Top Logo Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center px-8 py-6 lg:px-20 lg:py-8"
        >
          <div className="flex items-center">
            <img src={logo} alt="Luxury Living Logo" className="w-12 h-12 lg:w-16 lg:h-16" />
            <h2 className="ml-4 text-2xl lg:text-3xl font-light">
              <span className="font-bold text-[#D09683]">Luxury</span> Living
            </h2>
          </div>
          
          <button 
            className="px-4 py-2 border border-[#D09683] text-[#D09683] rounded-md hover:bg-[#D09683]/10 transition-colors"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </motion.div>

        {/* Main Content - Side-by-side layout */}
        <div className="flex flex-col lg:flex-row flex-1 px-8 lg:px-20">
          {/* Left Side - Main Message */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex flex-col justify-center lg:pr-20"
          >
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-light leading-tight">
              Experience <br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D09683] to-[#e9c2b5]">
                Unparalleled
              </span> <br />
              Luxury
            </h1>
            
            <p className="mt-8 text-xl lg:text-2xl text-gray-300 max-w-2xl">
              Discover a world where elegance meets comfort, and every detail is curated for the discerning individual.
            </p>
            
            <div className="h-1 w-32 bg-gradient-to-r from-[#D09683] to-transparent my-8"></div>
            
            <p className="text-gray-400 mb-8">
              Join our exclusive community of homeowners, service providers, and tenants.
            </p>
          </motion.div>
          
          {/* Right Side - Role Selection */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 flex flex-col justify-center mt-12 lg:mt-0"
          >
            <div className="bg-black/30 backdrop-filter backdrop-blur-md rounded-2xl border border-white/10 p-8 lg:p-10">
              <h2 className="text-2xl lg:text-3xl font-light mb-6 text-center">
                Select Your <span className="font-bold text-[#D09683]">Role</span>
              </h2>
              
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                {[
                  { 
                    role: "owner", 
                    label: "Property Owner", 
                    description: "Manage your luxury properties and connect with tenants",
                    icon: "🏛️", 
                    primary: true 
                  },
                  { 
                    role: "vendor", 
                    label: "Service Vendor", 
                    description: "Offer premium services to luxury properties",
                    icon: "🛠️", 
                    primary: false 
                  },
                  { 
                    role: "tenant", 
                    label: "Tenant", 
                    description: "Find and enjoy exceptional living spaces",
                    icon: "🏠", 
                    primary: true 
                  }
                ].map((item, index) => (
                  <motion.button
                    key={item.role}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.6 + (index * 0.1) 
                    }}
                    className={`w-full flex items-center px-6 py-5 ${item.primary ? 'bg-gradient-to-r from-[#D09683] to-[#c88975]' : 'bg-white'} 
                      ${item.primary ? 'text-white' : 'text-[#330000]'} 
                      font-medium text-lg rounded-xl shadow-lg transition-all`}
                    onClick={() => navigate(`/auth?role=${item.role}`)}
                  >
                    <span className="text-2xl mr-4">{item.icon}</span>
                    <div className="text-left">
                      <div className="font-bold">{item.label}</div>
                      <div className={`text-sm mt-1 ${item.primary ? 'text-white/80' : 'text-[#330000]/80'}`}>
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer - Simple Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="py-6 px-8 lg:px-20 text-center text-white/60 text-sm"
        >
          © 2025 Luxury Living. All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

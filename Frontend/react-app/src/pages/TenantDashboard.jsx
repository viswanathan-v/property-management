import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiAlertCircle,
  FiHome,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const TenantDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");
  // const [issues, setIssues] = useState([]);
  const [acceptedIssues,setAcceptedIssues] =useState([]);
  const [tenant, setTenant] = useState({
    tenant_id: "",
    tenant_name: "",
    email: "",
    mobile_number: "",
    family_count: "",
    matched_owner: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", message: "", address: "", location: "" });
  const [issueData, setIssueData] = useState({ statement: "", type: "", estimated_days: "" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [jToken,setJToken] = useState("");
  useEffect(() => {
    const storedOwner = localStorage.getItem("User");
    if (storedOwner) {
      const parsedData = JSON.parse(storedOwner);
      setTenant(parsedData.User); // Set only the user object
      setJToken(localStorage.getItem("token"));
    }
  }, []);
  
  useEffect(() => {
    if (tenant && tenant.tenant_id && jToken) {
      axios.get(`http://localhost:8080/Tenant/Issue-status/${tenant.tenant_id}`, {
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      })
      .then((response) => {
        console.log("Issues Related to Tenant:", response.data);
        setAcceptedIssues(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pending issues:", error);
      });
    }
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tenant, jToken]);
  
    // Add mouse position tracking for parallax effect
    
  // }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssueChange = (e) => {
    setIssueData({ ...issueData, [e.target.name]: e.target.value });
  };

  const handleSignOut = () => {
    localStorage.removeItem("User");
    navigate("/");
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    const requestissue = {
      tenant_id: tenant.tenant_id,
      owner_id: tenant.matched_owner.owner_id,
      posted: new Date().toISOString().replace("T", " ").split(".")[0],
      ...issueData,
    };
    console.log(requestissue);
    try {
      const response = await axios.post("http://localhost:8080/Tenant/Raise-issue", requestissue, {
        headers: { 
          Authorization: `Bearer ${jToken}`,
        },
      });
      
      alert("Submitted successful!");
      
      console.log("Issue Submitted Successfully:", response.data);
    }catch (error) {
      const errMsg = error.response?.data || error.message || "Unknown error";
      console.error("Submission Failed!!", errMsg);
      alert(`Submission Failed!! ${errMsg}`);
    }
    
  };

  const handleOwnerRequest = async (e) => {
    e.preventDefault();
    const requestData = {
      id: tenant.tenant_id,
      ...formData,
    };
    try {
      await axios.post("http://localhost:8080/Tenant/Owner-Request", requestData,{
        headers: {
          Authorization: `Bearer ${jToken}`,
        }
      });
      alert("Successfully submitted");
    } catch (err) {
      console.error("Submission Failed!!", err);
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

      {/* Sidebar */}
      <div 
        className={`transition-all duration-500 ${isSidebarOpen ? "w-64" : "w-20"} h-full z-20 flex flex-col p-6 bg-gradient-to-b from-[#2D1D1D] to-[#1A0F0F] backdrop-blur-lg border-r border-[#D09683]/20 shadow-lg`}
      >
        {/* Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="mb-10 text-2xl self-center text-[#D09683] hover:text-[#E5B3A0] transition-colors"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        {/* Sidebar Buttons */}
        <button 
          className={`flex items-center space-x-3 mb-6 py-3 px-4 rounded-lg transition-all duration-300 ${activeView === "home" ? "bg-[#D09683]/20 text-[#D09683]" : "text-[#D09683]/70 hover:text-[#D09683]"}`} 
          onClick={() => setActiveView("home")}
        >
          <FiHome className="text-xl" /> 
          {isSidebarOpen && <span className="font-light tracking-wide">Home</span>}
        </button>
        
        {tenant.matched_owner && (
          <button 
            className={`flex items-center space-x-3 mb-6 py-3 px-4 rounded-lg transition-all duration-300 ${activeView === "raiseIssue" ? "bg-[#D09683]/20 text-[#D09683]" : "text-[#D09683]/70 hover:text-[#D09683]"}`} 
            onClick={() => setActiveView("raiseIssue")}
          >
            <FiAlertCircle className="text-xl" /> 
            {isSidebarOpen && <span className="font-light tracking-wide">Raise Issues</span>}
          </button>
          
        )}
         {tenant.matched_owner && (<button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "issues" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("Issues - Status")}
            > 
              <FiAlertCircle size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Issue Status</span>}
            </button>
         )}
        {/* Profile and Sign-out */}
        <div className="mt-auto">
          <button 
            className="flex items-center space-x-3 mb-6 py-3 px-4 rounded-lg transition-all duration-300 text-[#D09683]/70 hover:text-[#D09683] hover:bg-[#D09683]/10" 
            onClick={() => setIsProfileOpen(true)}
          >
            <FiUser className="text-xl" /> 
            {isSidebarOpen && <span className="font-light tracking-wide">Profile</span>}
          </button>
          
          <button 
            className="flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 text-[#D09683]/70 hover:text-[#FF9E80] hover:bg-[#FF9E80]/10" 
            onClick={handleSignOut}
          >
            <FiLogOut className="text-xl" /> 
            {isSidebarOpen && <span className="font-light tracking-wide">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 z-10 flex flex-col p-8 overflow-y-auto">
        <div className="text-3xl font-light mb-2 text-[#D09683]">
          <span className="font-bold">Luxury</span> Living
        </div>
        
        <div className="flex-1 bg-[#2D1D1D]/60 backdrop-blur-md rounded-2xl shadow-2xl border border-[#D09683]/20 p-8 overflow-hidden">
          {activeView === "home" && (
            <div className="flex flex-col h-full">
              <h2 className="text-4xl font-light mb-2 text-white">
                Request <span className="font-bold text-[#D09683]">Owner</span>
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-[#D09683] to-transparent mb-8"></div>
              
              <form onSubmit={handleOwnerRequest} className="w-full flex flex-col items-center space-y-6">
                {Object.keys(formData).map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-3/4 p-4 bg-[#000000]/30 text-white rounded-lg border border-[#D09683]/30 placeholder-[#D09683]/50 outline-none focus:border-[#D09683] transition-colors"
                  />
                ))}
                <button 
                  type="submit" 
                  className="mt-6 px-10 py-4 bg-gradient-to-r from-[#D09683] to-[#BC8778] text-[#190000] font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Submit Request
                </button>
              </form>
            </div>
          )}

          {activeView === "raiseIssue" && (
            <div className="flex flex-col h-full">
              <h2 className="text-4xl font-light mb-2 text-white">
                Raise an <span className="font-bold text-[#D09683]">Issue</span>
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-[#D09683] to-transparent mb-8"></div>
              
              <form onSubmit={handleIssue} className="w-full flex flex-col items-center space-y-6">
                {Object.keys(issueData).map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={issueData[key]}
                    onChange={handleIssueChange}
                    required
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
                    className="w-3/4 p-4 bg-[#000000]/30 text-white rounded-lg border border-[#D09683]/30 placeholder-[#D09683]/50 outline-none focus:border-[#D09683] transition-colors"
                  />
                ))}
                <button 
                  type="submit" 
                  className="mt-6 px-10 py-4 bg-gradient-to-r from-[#D09683] to-[#BC8778] text-[#190000] font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Submit Issue
                </button>
              </form>
            </div>
          )}

{activeView === "Issues - Status" && (
  <div className="p-8">
    <h2 className="text-3xl font-light mb-8 text-center">
      <span className="font-bold text-[#D09683]">Issue</span> status List
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {acceptedIssues.length > 0 ? (acceptedIssues.map((aissue) =>
        <motion.div
          key={aissue.issue_id}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#2A0000] to-[#380000] p-6 rounded-xl shadow-lg border border-[#D09683]/20"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683]">
              <FiAlertCircle size={20} />
            </div>
            <h3 className="text-xl font-light ml-3 text-[#D09683]">
              Accepted Issue Report
            </h3>
          </div>
          
          <div className="space-y-3 text-gray-300 mb-6">
            <p className="bg-[#D09683]/10 p-3 rounded-lg">
              {aissue.description}
            </p>
            <p className="bg-[#D09683]/10 p-3 rounded-lg">
              {aissue.status}
            </p>
            <p className="flex items-center">
              <span className="text-[#D09683] mr-2">⚠️</span>
              <span className="font-medium">Severity:</span>
              <span className={`ml-2 ${aissue.severity === 'High' ? 'text-red-400' : aissue.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                {aissue.severity}
              </span>
            </p>
            <p className="flex items-center">
              <span className="text-[#D09683] mr-2">👤</span>
              <span className="font-medium">Reported by:</span>
              <span className="ml-2">{aissue.tenants.tenant_name}</span>
            </p>
            <p className="flex items-center">
              <span className="text-[#D09683] mr-2">👤</span>
              <span className="font-medium"> Issue Type:</span>
              <span className="ml-2">{aissue.issue_type}</span>
            </p>
          </div>
          
          {/* Issue Actions */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {/* No action buttons needed here for Accepted Issues */}
          </div>
        </motion.div>
      )) : (
        <div className="col-span-3 text-center p-10 text-gray-400">
          No accepted issues at the moment.
        </div>
      )}
    </div>
  </div>
)}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-[#2D1D1D] to-[#1A0F0F] p-8 rounded-xl shadow-2xl w-96 border border-[#D09683]/30 text-center">
            <div className="w-24 h-24 rounded-full bg-[#D09683]/20 flex items-center justify-center mx-auto mb-6">
              <FiUser className="text-6xl text-[#D09683]" />
            </div>
            
            <h2 className="text-3xl font-light text-white mb-6">
              Tenant <span className="font-bold text-[#D09683]">Profile</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              {Object.entries(tenant).filter(([key]) => key !== "matched_owner" && key!=="password" && key!=="tenant_id"  ).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center border-b border-[#D09683]/20 pb-2">
                  <span className="text-[#D09683]">{key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
            
            <button 
              className="px-8 py-3 bg-gradient-to-r from-[#D09683] to-[#BC8778] text-[#190000] font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={() => setIsProfileOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Add keyframes for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default TenantDashboard;
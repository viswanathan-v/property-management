import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiTool, FiAlertCircle, FiHome, FiUser, FiLogOut, FiCheck, FiX as FiCross, FiClock, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // Assuming you have a logo

const VendorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("pendingIssues");
  const [pendingIssues, setPendingIssues] = useState([]);
  const [acceptedIssues, setAcceptedIssues] = useState([]);
  const [vendor, setVendor] = useState({ vendor_id: "", vendor_name: "", email: "", mobile_number: "", address: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [jToken,setJToken] =useState("");
  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  useEffect(() => {
    // Fetch local storage data
    const storedOwner = localStorage.getItem("User");
if (storedOwner) {
  const parsedData = JSON.parse(storedOwner);
  setVendor(parsedData.User); // ✅ set only the User object
  console.log(parsedData.User); // will log the proper owner object
  console.log(parsedData); // full object
  console.log(parsedData.role); // OWNER
} 
  const token=localStorage.getItem("token");
  console.log(token);
  setJToken(token);
  
    if (vendor?.vendor_id) {
      // Fetch pending issues related to vendor
      axios.get(`http://localhost:8080/Vendor/Issue-list/${vendor.vendor_id}`,{
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      })
        .then((response) => {
          console.log("Pending Issues:", response.data);
          setPendingIssues(response.data);
        })
        .catch((err) => console.error("Error fetching pending issues:", err));
      
      // Fetch accepted issues (assuming endpoint exists)
      axios.get(`http://localhost:8080/Vendor/Assigned-Issue/${vendor.vendor_id}`,{
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      })
        .then((response) => {
          console.log("Accepted Issues:", response.data);
          setAcceptedIssues(response.data);
        })
        .catch((err) => console.error("Error fetching accepted issues:", err));
    }
  }, [vendor?.vendor_id]);

  const handleAcceptIssue = async (issueId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/Vendor/${issueId}/accept/${vendor.vendor_id}`,null,{
          headers: {
            Authorization: `Bearer ${jToken}`
          }
        }
      );
      console.log("Issue Accepted:", response.data);
      alert("Issue accepted successfully!");
      
      // Refresh both issue lists
      refreshIssueLists();
    } catch (error) {
      console.error("Error accepting issue:", error);
      alert("Failed to accept issue.");
    }
  };

  const handleRejectIssue = async (issueId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/Vendor/${issueId}/reject/${vendor.vendor_id}`,null,{
          headers: {
            Authorization: `Bearer ${jToken}`
          }
        }
      );
      console.log("Issue Rejected:", response.data);
      alert("Issue rejected successfully!");
      
      // Refresh pending issues list
      refreshIssueLists();
    } catch (error) {
      console.error("Error rejecting issue:", error);
      alert("Failed to reject issue.");
    }
  };

  const handleCompleteIssue = async (issueId) => {
    try {
      // Assuming there's an endpoint to mark issues as completed
      const response = await axios.post(
        `http://localhost:8080/Vendor/${issueId}/complete/${vendor.vendor_id}`,null,{
          headers: {
            Authorization: `Bearer ${jToken}`
          }
        }
      );
      console.log("Issue Completed:", response.data);
      alert("Issue marked as completed successfully!");
      
      // Refresh accepted issues list
      refreshIssueLists();
    } catch (error) {
      console.error("Error completing issue:", error);
      alert("Failed to mark issue as completed.");
    }
  };

  const refreshIssueLists = () => {
    // Refresh pending issues
    axios.get(`http://localhost:8080/Vendor/Issue-list/${vendor.vendor_id}`,{
      headers: {
        Authorization: `Bearer ${jToken}`
      }
    })
      .then((response) => {
        setPendingIssues(response.data);
      })
      .catch((err) => console.error("Error fetching pending issues:", err));
    
    // Refresh accepted issues
    axios.get(`http://localhost:8080/Vendor/Accepted-Issues/${vendor.vendor_id}`,{
      headers: {
        Authorization: `Bearer ${jToken}`
      }
    })
      .then((response) => {
        setAcceptedIssues(response.data);
      })
      .catch((err) => console.error("Error fetching accepted issues:", err));
  };

  const handleSignOut = () => {
    localStorage.removeItem("User");
    navigate("/");
  };

  return (
    <div className="h-screen w-screen flex items-stretch bg-[#190000] text-white relative overflow-hidden">
      {/* Fullscreen background with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://source.unsplash.com/1920x1080/?workshop,tools,repair')",
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

      {/* Layout Structure */}
      <div className="flex w-full h-full z-10">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-[#2A0000] to-[#3E2C2C] h-full shadow-2xl border-r border-[#D09683]/30 flex flex-col p-4`}
        >
          <div className="flex items-center justify-between mb-10">
            {isSidebarOpen && (
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <h2 className="text-xl font-light ml-2">
                  <span className="font-bold text-[#D09683]">Luxury</span> Living
                </h2>
              </div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-[#D09683] hover:text-[#e9c2b5] transition-colors p-2 rounded-full hover:bg-[#D09683]/10"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          
          <nav className="flex flex-col space-y-6">
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "pendingIssues" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("pendingIssues")}
            > 
              <FiAlertCircle size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Pending Issues</span>}
            </button>
            
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "acceptedIssues" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("acceptedIssues")}
            > 
              <FiTool size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Accepted Issues</span>}
            </button>
          </nav>
          
          <div className="mt-auto border-t border-[#D09683]/20 pt-6 space-y-4">
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} w-full p-3 rounded-xl text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683] transition-all duration-200`}
              onClick={() => setIsProfileOpen(true)}
            >
              <FiUser size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Profile</span>}
            </button>
            
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200`}
              onClick={handleSignOut}
            >
              <FiLogOut size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Sign Out</span>}
            </button>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          {/* Page Header */}
          <div className="mb-10 flex justify-between items-center">
            <h1 className="text-4xl font-light">
              <span className="font-bold text-[#D09683]">{activeView === "pendingIssues" ? "Pending Issues" : "Accepted Issues"}</span> Dashboard
            </h1>
            <div className="text-[#D09683] opacity-80">
              Welcome, {vendor.vendor_name}
            </div>
          </div>
          
          {/* Content Views */}
          <div className="bg-[#1A0000]/60 backdrop-blur-md rounded-3xl shadow-2xl border border-[#D09683]/20 overflow-hidden">
            {/* 1. Pending Issues View */}
            {activeView === "pendingIssues" && (
              <div className="p-8">
                <h2 className="text-3xl font-light mb-8 text-center">
                  <span className="font-bold text-[#D09683]">Issue</span> Requests
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingIssues.length > 0 ? pendingIssues.map((issue) => (
                    <motion.div
                      key={issue.issue_id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-[#2A0000] to-[#380000] p-6 rounded-xl shadow-lg border border-[#D09683]/20"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683]">
                          <FiAlertCircle size={20} />
                        </div>
                        <h3 className="text-xl font-light ml-3 text-[#D09683]">
                          New Request
                        </h3>
                      </div>
                      
                      <div className="space-y-3 text-gray-300 mb-6">
                        <p className="bg-[#D09683]/10 p-3 rounded-lg">
                          {issue.description}
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">⚠️</span>
                          <span className="font-medium">Severity:</span>
                          <span className={`ml-2 ${issue.severity === 'High' ? 'text-red-400' : issue.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                            {issue.severity}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">📍</span>
                          <span className="font-medium">Location:</span>
                          <span className="ml-2">{issue.owners?.address || "Not specified"}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">👤</span>
                          <span className="font-medium">Reported by:</span>
                          <span className="ml-2">{issue.tenants?.tenant_name || "Unknown"}</span>
                        </p>
                      </div>
                      
                      {/* Issue Actions */}
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          className="flex items-center justify-center py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-colors"
                          onClick={() => handleAcceptIssue(issue.issue_id)}
                        >
                          <FiCheck className="mr-2" size={16} />
                          Accept
                        </button>
                        <button
                          className="flex items-center justify-center py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-colors"
                          onClick={() => handleRejectIssue(issue.issue_id)}
                        >
                          <FiCross className="mr-2" size={16} />
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-3 text-center p-10 text-gray-400">
                      No pending issue requests at the moment.
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 2. Accepted Issues View */}
            {activeView === "acceptedIssues" && (
              <div className="p-8">
                <h2 className="text-3xl font-light mb-8 text-center">
                  <span className="font-bold text-[#D09683]">Accepted</span> Issues
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {acceptedIssues.length > 0 ? acceptedIssues.map((issue) => (
                    <motion.div
                      key={issue.issue_id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-[#2A0000] to-[#380000] p-6 rounded-xl shadow-lg border border-[#D09683]/20"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683]">
                          <FiTool size={20} />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-xl font-light text-[#D09683]">
                            In Progress
                          </h3>
                          <p className="text-xs text-gray-400">Accepted on {new Date(issue.updated_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-gray-300 mb-6">
                        <p className="bg-[#D09683]/10 p-3 rounded-lg">
                          {issue.description}
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">⚠️</span>
                          <span className="font-medium">Severity:</span>
                          <span className={`ml-2 ${issue.severity === 'High' ? 'text-red-400' : issue.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                            {issue.severity}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">📍</span>
                          <span className="font-medium">Location:</span>
                          <span className="ml-2">{issue.tenants.address || "Not specified"}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">🕒</span>
                          <span className="font-medium">Status:</span>
                          <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-xs">In Progress</span>
                        </p>
                      </div>
                      
                      {/* Mark as Completed Action */}
                      <button
                        className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-colors"
                        onClick={() => handleCompleteIssue(issue.issue_id)}
                      >
                        <FiCheckCircle className="mr-2" size={16} />
                        Mark as Completed
                      </button>
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
        </motion.div>
      </div>
      
      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#2A0000] to-[#3E2C2C] p-8 rounded-2xl shadow-2xl border border-[#D09683]/30 w-96"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683] mx-auto">
                <FiUser size={40} />
              </div>
              <h2 className="text-2xl font-light mt-4">
                <span className="font-bold text-[#D09683]">Vendor</span> Profile
              </h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-[#D09683]">{vendor.vendor_name}</p>
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="text-[#D09683]">{vendor.email}</p>
              </div>

              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Service Type</p>
                <p className="text-[#D09683]">{vendor.job}</p>
              </div>              
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-[#D09683]">{vendor.mobile_number}</p>
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-[#D09683]">{vendor.address}</p>
              </div>
            </div>
            
            <button 
              className="w-full py-3 bg-gradient-to-r from-[#D09683] to-[#e9c2b5] text-[#1A0000] font-medium rounded-lg shadow-md hover:from-[#e9c2b5] hover:to-[#D09683] transition-colors"
              onClick={() => setIsProfileOpen(false)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
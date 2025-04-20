import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUserPlus, FiAlertCircle, FiHome, FiUser, FiLogOut, FiCheck, FiX as FiCross, FiSend } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // Assuming you have a logo

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [tenants, setTenants] = useState([]);
  const [issues, setIssues] = useState([]);
  const [acceptedIssues,setAcceptedIssues] = useState([]);
  const [owner, setOwner] = useState({ owner_id:"", owner_name: "", email: "", mobile_number: "", address: "" });
  const [requestedTenants, setRequestedTenants] = useState([]);
  const [requests, setRequest] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [vendorData, setVendorData] = useState({
    vendor_name: "",
    email: "",
    mobile_number: "",
    address: ""
  });
  const navigate = useNavigate();
  const [jToken,setJToken] = useState("");

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
  setOwner(parsedData.User); // ✅ set only the User object
  // console.log(parsedData.User); // will log the proper owner object
  // console.log(parsedData); // full object
  // console.log(parsedData.role); // OWNER
}
setJToken(localStorage.getItem("token"));
    if (owner?.owner_id) {
      // Fetch accepted requests
      axios.get(`http://localhost:8080/Owner/Accepted-Request/${owner.owner_id}`,{
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      }).then((response) => {
          console.log("Accepted Requests:", response.data,"-",typeof(response.data[0]));
          const extractedTenants = response.data.map((request) => request.tenants);
          setTenants(extractedTenants);
        })
        .catch((error) => console.error("Error fetching accepted requests:", error));
  
      // Fetch pending issues
      axios.get(`http://localhost:8080/Owner/PendingIssue/${owner.owner_id}`,{
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      })
        .then((response) => {
          console.log("Issues Related to Owner:", response.data,"-",typeof(response.data));
          setIssues(response.data);
        })
        .catch((err) => console.error("Error fetching pending issues:", err));
        axios.get(`http://localhost:8080/Owner/All-Issues/${owner.owner_id}`,{
          headers: {
            Authorization: `Bearer ${jToken}`
          }
        })
        .then((response) => {
          console.log("Issues Related to Owner:", response.data,"-",typeof(response.data));
          setAcceptedIssues(response.data);
        })
        .catch((err) => console.error("Error fetching pending issues:", err));
        
      // Fetch pending requests
      axios.get(`http://localhost:8080/Owner/Pending-Request/${owner.owner_id}`,{
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      })
        .then((response) => {
          console.log("Pending Requests:", response.data,"-",typeof(response.data));
          setRequest(response.data);
        })
        .catch((err) => console.error("Error fetching pending tenant requests:", err));
    }
  }, [owner?.owner_id]);
  
  const updateStatus = async (requestId, status) => {
    try {
      const response = await axios.put(`http://localhost:8080/Owner/${requestId}/update-status`, null, {
        params: { status: status }, headers: {
          Authorization: `Bearer ${jToken}`
        }
      });
      console.log("Status Updated:", response.data);
      alert("Status updated successfully!");
      // Refresh the requests list
      axios.get(`http://localhost:8080/Owner/Pending-Request/${owner.owner_id}`,{
        headers: {
          Authorization: `Bearer ${jToken}`
        }
      })
        .then((response) => {
          setRequest(response.data);
        })
        .catch((err) => console.error("Error fetching pending tenant requests:", err));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("User");
    navigate("/");
  };

  const handleVendorInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const openAssignModal = (issueId) => {
    setSelectedIssueId(issueId);
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedIssueId(null);
    setVendorData({
      vendor_name: "",
      email: "",
      mobile_number: "",
      address: ""
    });
  };

  const handleAssignVendor = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/Issues/${selectedIssueId}/assign/manual`,
        vendorData,{
          headers: { 
            Authorization: `Bearer ${jToken}`,
          },
        });
      console.log("Vendor Assigned:", response.data);
      alert("Vendor assigned successfully!");
      closeAssignModal();
      
      // Refresh the issues list
      axios.get(`http://localhost:8080/Owner/PendingIssue/${owner.owner_id}`,{
        headers: { 
          Authorization: `Bearer ${jToken}`,
        },
      })
        .then((response) => {
          setIssues(response.data);
        })
        .catch((err) => console.error("Error fetching pending issues:", err));
    } catch (error) {
      console.error("Error assigning vendor:", error);
      alert("Failed to assign vendor.");
    }
  };

  const handleRejectIssue = async (issueId) => {
    try {
      const response = await axios.put(`http://localhost:8080/Issues/Reject/${issueId}`,null,{
        headers: { 
          Authorization: `Bearer ${jToken}`,
        }
      });
      console.log("Issue Rejected:", response.data);
      alert("Issue rejected successfully!");
      
      // Refresh the issues list
      axios.get(`http://localhost:8080/Owner/PendingIssue/${owner.owner_id}`,{
        headers: { 
          Authorization: `Bearer ${jToken}`,
        },
      })
        .then((response) => {
          setIssues(response.data);
        })
        .catch((err) => console.error("Error fetching pending issues:", err));
    } catch (error) {
      console.error("Error rejecting issue:", error);
      alert("Failed to reject issue.");
    }
  };

  const handleRequestVendor = async (issueId) => {
    try {
      // // Ensure owner_id is available
      console.log("Issue -id"+issueId);  
      const response = await axios.post(`http://localhost:8080/Issues/${issueId}/send-requests`,null,{
        headers: { 
          Authorization: `Bearer ${jToken}`,
        }
      });
      alert("Vendor requests sent to all matching vendors successfully!");
      console.log("Vendor Requests Sent:", response.data);
  
      // Refresh the issues list
      // const updatedIssues = await axios.get(`http://localhost:8080/Owner/PendingIssue/${owner.owner_id}`);
      // setIssues(updatedIssues.data);
  
    } catch (error) {
      console.error("Error sending vendor requests:", error);
      alert("Failed to send vendor requests.");
    }
  };
  

  return (
    <div className="h-screen w-screen flex items-stretch bg-[#190000] text-white relative overflow-hidden">
      {/* Fullscreen background with parallax effect */}
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
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "home" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("home")}
            > 
              <FiHome size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Home</span>}
            </button>
            
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "addTenant" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("addTenant")}
            > 
              <FiUserPlus size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Add Tenant</span>}
            </button>
            
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "issues" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("issues")}
            > 
              <FiAlertCircle size={20} />
              {isSidebarOpen && <span className="ml-3 font-light">Issue List</span>}
            </button>
            <button 
              className={`flex ${isSidebarOpen ? "items-center justify-start" : "justify-center"} p-3 rounded-xl transition-all duration-200 ${activeView === "issues" ? "bg-[#D09683]/20 text-[#D09683]" : "text-gray-300 hover:bg-[#D09683]/10 hover:text-[#D09683]"}`}
              onClick={() => setActiveView("Accepted-Issue")}
            > 
              <FiAlertCircle size={20} />
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
              <span className="font-bold text-[#D09683]">{activeView === "home" ? "Home" : activeView === "addTenant" ? "Add Tenant" : "Issues"}</span> Dashboard
            </h1>
            <div className="text-[#D09683] opacity-80">
              Welcome, {owner.owner_name}
            </div>
          </div>
          
          {/* Content Views */}
          <div className="bg-[#1A0000]/60 backdrop-blur-md rounded-3xl shadow-2xl border border-[#D09683]/20 overflow-hidden">
            {activeView === "home" && (
              <div className="p-8">
                <h2 className="text-3xl font-light mb-8 text-center">
                  <span className="font-bold text-[#D09683]">Available</span> Tenants
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tenants.length > 0 ? tenants.map((tenant) => (
                    <motion.div
                      key={tenant.tenant_id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-[#2A0000] to-[#380000] p-6 rounded-xl shadow-lg border border-[#D09683]/20"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683]">
                          <FiUser size={20} />
                        </div>
                        <h3 className="text-xl font-light ml-3">
                          <span className="font-bold text-[#D09683]">{tenant.tenant_name}</span>
                        </h3>
                      </div>
                      
                      <div className="space-y-3 text-gray-300">
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">✉️</span>
                          {tenant.email}
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">📞</span>
                          {tenant.mobile_number}
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">📍</span>
                          {tenant.address}, {tenant.location}
                        </p>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-3 text-center p-10 text-gray-400">
                      No tenants available at the moment.
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeView === "addTenant" && (
              <div className="p-8">
                <h2 className="text-3xl font-light mb-8 text-center">
                  <span className="font-bold text-[#D09683]">Requested</span> Tenants
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.length > 0 ? requests.map((request) => {
                    const tenant = request.tenants;
                    return (
                      <motion.div
                        key={request.request_id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#2A0000] to-[#380000] p-6 rounded-xl shadow-lg border border-[#D09683]/20"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683]">
                            <FiUserPlus size={20} />
                          </div>
                          <h3 className="text-xl font-light ml-3">
                            <span className="font-bold text-[#D09683]">{tenant.tenant_name}</span>
                          </h3>
                        </div>
                        
                        <div className="space-y-3 text-gray-300 mb-6">
                          <p className="flex items-center">
                            <span className="text-[#D09683] mr-2">✉️</span>
                            {tenant.email}
                          </p>
                          <p className="flex items-center">
                            <span className="text-[#D09683] mr-2">📞</span>
                            {tenant.mobile_number}
                          </p>
                          <p className="flex items-center">
                            <span className="text-[#D09683] mr-2">📍</span>
                            {request.requested_address}, {request.req_location}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-colors"
                            onClick={() => updateStatus(request.request_id, "Accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-colors"
                            onClick={() => updateStatus(request.request_id, "Rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-3 text-center p-10 text-gray-400">
                      No pending tenant requests at the moment.
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeView === "issues" && (
              <div className="p-8">
                <h2 className="text-3xl font-light mb-8 text-center">
                  <span className="font-bold text-[#D09683]">Issue</span> List
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {issues.length > 0 ? issues.map((issue) => (
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
                          Issue Report
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
                          <span className="text-[#D09683] mr-2">👤</span>
                          <span className="font-medium">Reported by:</span>
                          <span className="ml-2">{issue.tenants.tenant_name}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-[#D09683] mr-2">👤</span>
                          <span className="font-medium"> Issue Type:</span>
                          <span className="ml-2">{issue.issue_type}</span>
                        </p>
                      </div>
                      
                      {/* Issue Actions */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <button
                          className="flex items-center justify-center py-2 px-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-colors text-sm"
                          onClick={() => openAssignModal(issue.issue_id)}
                        >
                          <FiCheck className="mr-1" size={14} />
                          Assign
                        </button>
                        <button
                          className="flex items-center justify-center py-2 px-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-colors text-sm"
                          onClick={() => handleRejectIssue(issue.issue_id)}
                        >
                          <FiCross className="mr-1" size={14} />
                          Reject
                        </button>
                        <button
                          className="flex items-center justify-center py-2 px-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-colors text-sm"
                          onClick={() => handleRequestVendor(issue.issue_id)}
                        >
                          <FiSend className="mr-1" size={14} />
                          Request
                        </button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-3 text-center p-10 text-gray-400">
                      No pending issues at the moment.
                    </div>
                  )}
                </div>
              </div>
            )}
             {activeView === "Accepted-Issue" && (
  <div className="p-8">
    <h2 className="text-3xl font-light mb-8 text-center">
      <span className="font-bold text-[#D09683]">Accepted</span> Issue List
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {acceptedIssues.length > 0 ? (acceptedIssues.filter((aissue) => aissue.status !== "Pending" && aissue.status!=="Rejected").map((aissue) =>
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
                <span className="font-bold text-[#D09683]">Owner</span> Profile
              </h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-[#D09683]">{owner.owner_name}</p>
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="text-[#D09683]">{owner.email}</p>
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-[#D09683]">{owner.mobile_number}</p>
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-[#D09683]">{owner.address}</p>
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
      
      {/* Assign Vendor Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#2A0000] to-[#3E2C2C] p-8 rounded-2xl shadow-2xl border border-[#D09683]/30 w-96"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#D09683]/20 flex items-center justify-center text-[#D09683] mx-auto">
                <FiUser size={32} />
              </div>
              <h2 className="text-2xl font-light mt-4">
                <span className="font-bold text-[#D09683]">Assign</span> Vendor
              </h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <label className="text-sm text-gray-400 block mb-1">Vendor Name</label>
                <input
                  type="text"
                  name="vendor_name"
                  value={vendorData.vendor_name}
                  onChange={handleVendorInputChange}
                  className="w-full bg-[#2A0000] text-[#D09683] border border-[#D09683]/30 rounded-lg p-2 focus:outline-none focus:border-[#D09683]"
                  placeholder="Enter vendor name"
                />
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <label className="text-sm text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={vendorData.email}
                  onChange={handleVendorInputChange}
                  className="w-full bg-[#2A0000] text-[#D09683] border border-[#D09683]/30 rounded-lg p-2 focus:outline-none focus:border-[#D09683]"
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <label className="text-sm text-gray-400 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobile_number"
                  value={vendorData.mobile_number}
                  onChange={handleVendorInputChange}
                  className="w-full bg-[#2A0000] text-[#D09683] border border-[#D09683]/30 rounded-lg p-2 focus:outline-none focus:border-[#D09683]"
                  placeholder="Enter mobile number"
                />
              </div>
              
              <div className="bg-[#1A0000]/60 p-3 rounded-lg">
                <label className="text-sm text-gray-400 block mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={vendorData.address}
                  onChange={handleVendorInputChange}
                  className="w-full bg-[#2A0000] text-[#D09683] border border-[#D09683]/30 rounded-lg p-2 focus:outline-none focus:border-[#D09683]"
                  placeholder="Enter address"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="flex-1 py-3 bg-gradient-to-r from-[#D09683] to-[#e9c2b5] text-[#1A0000] font-medium rounded-lg shadow-md hover:from-[#e9c2b5] hover:to-[#D09683] transition-colors"
                onClick={handleAssignVendor}
              >
                Assign
              </button>
              <button 
                className="flex-1 py-3 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                onClick={closeAssignModal}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignInSignUp from "./pages/SignInSignUp";
import SignupRole from "./pages/SignupRole";
import SignupOwner from "./pages/SignupOwner";
import SignupVendor from "./pages/SignupVendor";
import SignupTenant from "./pages/SignupTenant";
import OwnerDashboard from "./pages/OwnerDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import TenantDashboard from "./pages/TenantDashboard";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<SignInSignUp />} />
      <Route path="/signup-role" element={<SignupRole />} />
      <Route path="/signup/owner" element={<SignupOwner />} />
      <Route path="/signup/vendor" element={<SignupVendor />} />
      <Route path="/signup/tenant" element={<SignupTenant />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      <Route path="/tenant-dashboard" element={<TenantDashboard />} />
    </Routes>
  );
};

export default App;




// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

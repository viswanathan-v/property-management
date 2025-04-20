import { useNavigate } from "react-router-dom";

const SignupRole = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={() => navigate("/signup/owner")}>Owner</button>
      <button onClick={() => navigate("/signup/vendor")}>Vendor</button>
      <button onClick={() => navigate("/signup/tenant")}>Tenant</button>
    </div>
  );
};

export default SignupRole;
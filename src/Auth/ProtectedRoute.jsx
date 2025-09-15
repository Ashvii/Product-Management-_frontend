import { Navigate } from "react-router-dom";
import { getUserRole, isLoggedIn } from "./Intercept";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" />;
  }

  const role = getUserRole();
  console.log("User role:", role);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unreal" />; // unauthorized page
  }

  return children;
};

export default ProtectedRoute;

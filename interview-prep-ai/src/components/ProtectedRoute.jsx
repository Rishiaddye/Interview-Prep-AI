import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // ✅ check login status

  if (!user) {
    return <Navigate to="/" replace />; // redirect to landing page if not logged in
  }

  return children; // user exists → allow dashboard
};

export default ProtectedRoute;

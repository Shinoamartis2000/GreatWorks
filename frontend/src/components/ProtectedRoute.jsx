import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { status, user } = useAuth();

  if (status === null) {
    return <div className="flex min-h-[60vh] items-center justify-center">Checking access…</div>;
  }
  if (!status) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-brand-red" data-testid="access-denied">
        You do not have access to this area.
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;

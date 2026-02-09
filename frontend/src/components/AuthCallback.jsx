import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const AuthCallback = ({ sessionId }) => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const exchangeSession = async () => {
      await api.post("/auth/emergent/session", { session_id: sessionId });
      await refreshUser();
      navigate("/admin", { replace: true });
    };
    exchangeSession();
  }, [navigate, refreshUser, sessionId]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center" data-testid="auth-callback-loading">
      Processing sign-in…
    </div>
  );
};

export default AuthCallback;

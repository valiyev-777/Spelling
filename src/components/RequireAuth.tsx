// src/components/RequireAuth.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
};

export default RequireAuth;

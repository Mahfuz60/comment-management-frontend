import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (auth.status === "loading" || auth.status === "idle") {
    return <div style={{ padding: 16 }}>Checking session…</div>;
  }

  if (auth.status !== "authenticated") {
    const from = location.pathname + location.search;
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />;
  }

  return <>{children}</>;
}

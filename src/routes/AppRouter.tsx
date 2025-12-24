import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { CommentsPage } from "@/pages/CommentsPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useLazyMeQuery } from "@/features/auth/authApi";
import { useAppSelector } from "@/app/hooks";

export function AppRouter() {
  const authStatus = useAppSelector((s) => s.auth.status);
  const [triggerMe] = useLazyMeQuery();

  useEffect(() => {
    if (authStatus === "idle") {
      triggerMe();
    }
  }, [authStatus, triggerMe]);

  return (
    <Routes>
      <Route
        path="/comments/:entityType/:entityId"
        element={<CommentsPage />}
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/comments/:entityType/:entityId"
        element={
          <ProtectedRoute>
            <CommentsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

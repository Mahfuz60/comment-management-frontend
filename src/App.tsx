
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { CommentsPage } from "@/pages/CommentsPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLazyMeQuery } from "@/features/auth/authApi";
import { useAppSelector } from "@/app/hooks";
import { isCookieAuth } from "@/utils/env";

export default function App() {
  const auth = useAppSelector((s) => s.auth);
  const [triggerMe] = useLazyMeQuery();

  
  useEffect(() => {
    
    if (isCookieAuth && auth.status === "idle") {
      triggerMe();
    }

    
    if (!isCookieAuth && auth.token && !auth.user) {
      triggerMe();
    }
  }, [auth.status, auth.token, auth.user, triggerMe]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/comments/:entityType"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/comments/:entityType/:entityId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

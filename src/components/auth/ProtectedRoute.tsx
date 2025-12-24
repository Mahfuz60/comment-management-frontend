
import React from "react";
import { RequireAuth } from "./RequireAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}

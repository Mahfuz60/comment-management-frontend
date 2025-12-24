
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useAppSelector((s) => s.auth.status);
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();

  
  if (status === "loading") {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  const isAuthed = Boolean(token) || status === "authenticated";

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

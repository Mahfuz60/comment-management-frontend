import React from "react";
import styles from "./AppLayout.module.scss";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/Button";
import { logout } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand} onClick={() => navigate("/")}>
            Comment Management System
          </div>
          <div className={styles.right}>
            {user ? (
              <>
                <span className={styles.user}>
                  Signed in as <b>{user.name}</b>
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    dispatch(logout());
                    toast.success("Logged out");
                    navigate("/login", { replace: true });
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <span className={styles.user}>Not signed in</span>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

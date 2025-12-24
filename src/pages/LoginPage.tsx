import React, { useState } from "react";
import styles from "./LoginPage.module.scss";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLoginMutation, useLazyMeQuery } from "@/features/auth/authApi";
import toast from "react-hot-toast";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setToken, setUser } from "@/features/auth/authSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const [triggerMe] = useLazyMeQuery();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    // Basic validation
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      // Check if we got the token
      const token = (res as any)?.token;
      if (token) {
        dispatch(setToken(token));
      }

      // If the response already has the user, use it.
      // Otherwise fetch it with triggerMe().
      const user = (res as any)?.user;
      if (user) {
        dispatch(setUser(user));
      } else {
        const meRes = await triggerMe().unwrap();
        dispatch(setUser((meRes as any).user ?? meRes));
      }

      toast.success("Logged in");
      navigate("/comments/post/", { replace: true });
    } catch (err: any) {
      let msg = "Login failed";
      if (typeof err?.data?.message === "string") {
        msg = err.data.message;
      } else if (typeof err?.data?.error === "string") {
        msg = err.data.error;
      } else if (
        err?.data?.error?.message &&
        typeof err.data.error.message === "string"
      ) {
        msg = err.data.error.message;
      } else if (err?.message) {
        msg = err.message;
      }

      const userFriendlyMsg = msg.toLowerCase().includes("invalid credentials")
        ? "Incorrect email or password."
        : msg;

      toast.error(userFriendlyMsg);
      setValidationError(userFriendlyMsg);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        <form onSubmit={onSubmit} className={styles.form}>
          {validationError && (
            <div style={{ marginBottom: 16 }}>
              <Alert title="Login Failed" message={validationError} />
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>

          <p style={{ textAlign: "center", marginTop: 8 }}>
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

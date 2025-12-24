import React, { useState } from "react";
import styles from "./SignupPage.module.scss";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegisterMutation } from "@/features/auth/authApi";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const [register, { isLoading }] = useRegisterMutation();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (name.trim().length < 2) {
      setValidationError("Name must be at least 2 characters long.");
      return;
    }
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      toast.success("Signup successful. Please login.");
      navigate(`/login?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      let msg = "Signup failed";
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

      toast.error(msg);
      setValidationError(msg);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create account</h1>

        <form onSubmit={onSubmit} className={styles.form}>
          {validationError && (
            <div style={{ marginBottom: 16 }}>
              <Alert title="Signup Failed" message={validationError} />
            </div>
          )}
          <Input
            label="Name"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

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
            autoComplete="new-password"
            required
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up…" : "Sign up"}
          </Button>

          <p style={{ textAlign: "center", marginTop: 8 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

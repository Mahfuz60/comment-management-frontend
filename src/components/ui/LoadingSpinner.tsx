import React from "react";
import styles from "./LoadingSpinner.module.scss";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function LoadingSpinner({ size = "md", className }: Props) {
  const cls = [styles.spinner, styles[size], className]
    .filter(Boolean)
    .join(" ");
  return <div className={cls} role="status" aria-label="Loading" />;
}

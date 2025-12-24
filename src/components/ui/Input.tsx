import React from "react";
import styles from "./Input.module.scss";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

export function Input({ label, error, className, ...rest }: Props) {
  return (
    <label className={[styles.wrap, className].filter(Boolean).join(" ")}>
      {label && <div className={styles.label}>{label}</div>}
      <input className={styles.input} {...rest} />
      {error && <div className={styles.error}>{error}</div>}
    </label>
  );
}

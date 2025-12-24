import React from "react";
import styles from "./Button.module.scss";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export function Button({ variant = "primary", size = "md", className, ...rest }: Props) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");
  return <button className={cls} {...rest} />;
}

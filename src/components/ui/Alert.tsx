import React from "react";

type Props = {
  title: string;
  message?: string;
  action?: React.ReactNode;
};

export function Alert({ title, message, action }: Props) {
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
      {message && <div style={{ opacity: 0.8, marginBottom: action ? 10 : 0 }}>{message}</div>}
      {action}
    </div>
  );
}

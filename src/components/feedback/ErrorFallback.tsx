import React from "react";

type Props = {
  error: Error;
  reset: () => void;
};

export function ErrorFallback({ error, reset }: Props) {
  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Something went wrong</h2>
      <p style={{ opacity: 0.8 }}>{error.message}</p>
      <button onClick={reset} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
        Reload
      </button>
    </div>
  );
}

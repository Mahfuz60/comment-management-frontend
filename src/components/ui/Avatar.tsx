import React from "react";
import styles from "./Avatar.module.scss";

type Props = {
  name: string;
  src?: string;
  size?: number;
};

export function Avatar({ name, src, size = 36 }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className={styles.avatar} style={{ width: size, height: size }}>
      {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
    </div>
  );
}

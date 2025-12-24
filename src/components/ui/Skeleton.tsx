import React from "react";
import styles from "./Skeleton.module.scss";

type Props = {
  height?: number;
  width?: number | string;
  radius?: number;
};

export function Skeleton({ height = 14, width = "100%", radius = 10 }: Props) {
  return <div className={styles.skel} style={{ height, width, borderRadius: radius }} />;
}

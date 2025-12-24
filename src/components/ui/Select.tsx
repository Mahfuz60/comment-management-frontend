import React from "react";
import styles from "./Select.module.scss";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  width?: string;
};

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  width,
}: Props<T>) {
  return (
    <label className={styles.wrap} style={{ width }}>
      {label && <div className={styles.label}>{label}</div>}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

import React from "react";
import styles from "./Pagination.module.scss";
import { Button } from "./Button";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export function Pagination({ page, totalPages, onPageChange, disabled }: Props) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={styles.wrap}>
      <Button
        variant="secondary"
        size="sm"
        disabled={disabled || !canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>

      <div className={styles.meta}>
        Page <b>{page}</b> / {Math.max(1, totalPages)}
      </div>

      <Button
        variant="secondary"
        size="sm"
        disabled={disabled || !canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

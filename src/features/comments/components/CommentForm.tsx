import React, { useMemo, useState } from "react";
import styles from "./CommentForm.module.scss";
import { Button } from "@/components/ui/Button";

type Props = {
  initialValue?: string;
  placeholder?: string;
  maxLength?: number;
  submitLabel: string;
  cancelLabel?: string;
  autoFocus?: boolean;
  onSubmit: (content: string) => Promise<void> | void;
  onCancel?: () => void;
  disabled?: boolean;
};

export function CommentForm({
  initialValue = "",
  placeholder = "Write a comment…...",
  maxLength = 500,
  submitLabel,
  cancelLabel = "Cancel",
  autoFocus,
  onSubmit,
  onCancel,
  disabled,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const trimmed = value.trim();
  const error = useMemo(() => {
    if (!touched) return null;
    if (!trimmed) return "Comment cannot be empty.";
    if (trimmed.length > maxLength)
      return `Max length is ${maxLength} characters.`;
    return null;
  }, [touched, trimmed, maxLength]);

  const canSubmit = !disabled && !submitting && !error && trimmed.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await onSubmit(trimmed);
      setValue("");
      setTouched(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        rows={3}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={maxLength + 50}
        disabled={disabled || submitting}
      />
      <div className={styles.meta}>
        <div className={styles.left}>
          {error ? (
            <span className={styles.error}>{error}</span>
          ) : (
            <span className={styles.hint}>
              {trimmed.length}/{maxLength}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={disabled || submitting}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!canSubmit}
          >
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

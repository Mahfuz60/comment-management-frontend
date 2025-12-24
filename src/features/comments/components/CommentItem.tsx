import React, { useMemo, useState } from "react";
import styles from "./CommentItem.module.scss";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAppSelector } from "@/app/hooks";
import { formatRelativeTime } from "@/utils/time";
import type { CommentDTO, ReactionAction } from "../types";
import { CommentForm } from "./CommentForm";
import { env } from "@/utils/env";

type Props = {
  comment: CommentDTO;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReact: (id: string, action: ReactionAction) => Promise<void>;
  onReply?: (parentId: string, content: string) => Promise<void>;
  depth?: number;
  variant?: "card" | "minimal";
};

export function CommentItem({
  comment,
  onEdit,
  onDelete,
  onReact,
  onReply,
  depth = 0,
  variant = "card",
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);

  const timeLabel = useMemo(
    () => formatRelativeTime(comment.createdAt),
    [comment.createdAt]
  );

  const likeActive = comment.myReaction === "like";
  const dislikeActive = comment.myReaction === "dislike";

  const user = useAppSelector((state) => state.auth.user);

  const isAuthor = Boolean(user && user._id === comment.author._id);

  const canEdit = isAuthor;
  const canDelete = isAuthor || comment.canDelete;

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    setBusyDelete(true);
    try {
      await onDelete(comment._id);
    } finally {
      setBusyDelete(false);
    }
  }

  function decideAction(target: "like" | "dislike"): ReactionAction {
    if (target === "like") {
      if (comment.myReaction === "like") return "clear";
      return "like";
    }
    if (comment.myReaction === "dislike") return "clear";
    return "dislike";
  }

  return (
    <div
      className={[
        styles.item,
        variant === "card" ? styles.cardStyle : styles.minimalStyle,
      ].join(" ")}
    >
      <div className={styles.avatar}>
        <Avatar
          name={comment.author.name}
          src={comment.author.avatarUrl ?? ""}
          size={36}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.authorLine}>
            <span className={styles.author}>{comment.author.name}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.time}>{timeLabel}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span
                className={styles.edited}
                title={`Updated: ${comment.updatedAt}`}
              >
                edited
              </span>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className={styles.content}>{comment.content}</div>
        ) : (
          <CommentForm
            initialValue={comment.content}
            submitLabel="Save"
            cancelLabel="Cancel"
            onCancel={() => setIsEditing(false)}
            onSubmit={async (content) => {
              await onEdit(comment._id, content);
              setIsEditing(false);
            }}
          />
        )}

        <div className={styles.footer}>
          <button
            type="button"
            aria-pressed={likeActive}
            className={`${styles.reaction} ${
              likeActive ? styles.activeLike : ""
            }`}
            onClick={() => onReact(comment._id, decideAction("like"))}
          >
            Like ({comment.likeCount})
          </button>

          <button
            type="button"
            aria-pressed={dislikeActive}
            className={`${styles.reaction} ${
              dislikeActive ? styles.activeDislike : ""
            }`}
            onClick={() => onReact(comment._id, decideAction("dislike"))}
          >
            Dislike ({comment.dislikeCount})
          </button>

          {env.ENABLE_REPLIES && onReply && (
            <button
              className={styles.replyBtn}
              onClick={() => setIsReplying((v) => !v)}
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
          )}

          {canEdit && !isEditing && (
            <button
              className={styles.actionBtn}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}

          {canDelete && (
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={busyDelete}
            >
              {busyDelete ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>

        {env.ENABLE_REPLIES && onReply && isReplying && (
          <div className={styles.replyBox}>
            <CommentForm
              submitLabel="Reply"
              onCancel={() => setIsReplying(false)}
              onSubmit={async (content) => {
                await onReply(comment._id, content);
                setIsReplying(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

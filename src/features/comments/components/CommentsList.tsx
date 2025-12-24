import React from "react";
import styles from "./CommentsList.module.scss";
import type { CommentDTO, CommentsSort, ReactionAction } from "../types";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { env } from "@/utils/env";
import { CommentItem } from "./CommentItem";
import { ReplyThread } from "./ReplyThread";

type Props = {
  data: CommentDTO[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  sort: CommentsSort;
  loading?: boolean;
  fetching?: boolean;
  error?: string | null;
  onRetry: () => void;
  onSortChange: (sort: CommentsSort) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;

  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReact: (id: string, action: ReactionAction) => Promise<void>;
  onReply?: ((parentId: string, content: string) => Promise<void>) | undefined;
};

export function CommentsList({
  data,
  page,
  limit,
  totalCount,
  totalPages,
  sort,
  loading,
  fetching,
  error,
  onRetry,
  onSortChange,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onReact,
  onReply,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.left}>
          <div className={styles.title}>
            Comments <span className={styles.count}>({totalCount})</span>
          </div>
          {fetching && !loading && (
            <div className={styles.fetching}>Updating…</div>
          )}
        </div>

        <div className={styles.right}>
          <Select<CommentsSort>
            value={sort}
            onChange={onSortChange}
            options={[
              { value: "newest", label: "Newest" },
              { value: "mostLiked", label: "Most liked" },
              { value: "mostDisliked", label: "Most disliked" },
            ]}
          />
          <Select<string>
            value={String(limit)}
            width={"100px"}
            onChange={(v) => onLimitChange(Number(v))}
            options={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletons}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skelCard}>
              <Skeleton height={14} width={180} />
              <Skeleton height={12} width={120} />
              <Skeleton height={14} width={"100%"} />
              <Skeleton height={14} width={"90%"} />
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert
          title="Failed to load comments"
          message={error}
          action={
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          }
        />
      ) : data.length === 0 ? (
        <Alert title="No comments yet" message="Be the first to comment." />
      ) : (
        <>
          {env.ENABLE_REPLIES && onReply ? (
            <ReplyThread
              comments={data}
              onEdit={onEdit}
              onDelete={onDelete}
              onReact={onReact}
              onReply={onReply}
            />
          ) : (
            <div className={styles.list}>
              {data.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReact={onReact}
                />
              ))}
            </div>
          )}

          <div className={styles.footer}>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              disabled={!!fetching}
            />
          </div>
        </>
      )}
    </div>
  );
}

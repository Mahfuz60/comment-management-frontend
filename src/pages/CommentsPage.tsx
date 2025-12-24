import React, { useEffect, useMemo } from "react";
import styles from "./CommentsPage.module.scss";
import { useParams, useSearchParams } from "react-router-dom";
import { CommentForm } from "@/features/comments/components/CommentForm";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useReactToCommentMutation,
  useUpdateCommentMutation,
} from "@/features/comments/commentsApi";
import type { CommentsSort } from "@/features/comments/types";
import { parseQueryInt, parseSort } from "@/utils/urlState";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/app/hooks";
import { startCommentsSocket } from "@/features/comments/socket";
import { env } from "@/utils/env";
import { CommentsList } from "@/features/comments/components/CommentsList";

export function CommentsPage() {
  const { entityType, entityId } = useParams();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = parseSort(searchParams.get("sort"), "newest");
  const page = parseQueryInt(searchParams.get("page"), 1);
  const limit = parseQueryInt(searchParams.get("limit"), 10);

  
  const usedEntityId = entityId || "welcome";

  
  const valid = Boolean(entityType);

  const { data, isFetching, isLoading, error, refetch } = useGetCommentsQuery(
    {
      entityType: entityType ?? "",
      entityId: usedEntityId,
      sort,
      page,
      limit,
      includeReplies: true,
    },
    { skip: !valid }
  );

  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [reactToComment] = useReactToCommentMutation();

  useEffect(() => {
    if (env.ENABLE_SOCKET) startCommentsSocket(dispatch);
  }, [dispatch]);

  const errorText = useMemo(() => {
    if (!error) return null;
    return (
      (error as any)?.message ??
      (error as any)?.data?.message ??
      "Failed to load."
    );
  }, [error]);

  function setQuery(
    next: Partial<{ sort: CommentsSort; page: number; limit: number }>
  ) {
    const sp = new URLSearchParams(searchParams);
    if (next.sort) sp.set("sort", next.sort);
    if (typeof next.page === "number") sp.set("page", String(next.page));
    if (typeof next.limit === "number") sp.set("limit", String(next.limit));
    setSearchParams(sp, { replace: true });
  }

  async function onSubmitNew(content: string) {
    if (!valid || !entityType) return;
    try {
      await createComment({
        entityType,
        entityId: usedEntityId,
        content,
        parentId: null,
      }).unwrap();
    } catch (e: any) {
      toast.error(e?.error?.message ?? "Failed to post comment");
    }
  }

  async function onReply(parentId: string, content: string) {
    if (!valid || !entityType) return;
    try {
      await createComment({
        entityType,
        entityId: usedEntityId,
        content,
        parentId,
      }).unwrap();
    } catch (e: any) {
      toast.error(e?.error?.message ?? "Failed to post reply");
    }
  }

  async function onEdit(id: string, content: string) {
    if (!valid || !entityType) return;
    try {
      await updateComment({
        id,
        body: { content },
        entityType,
        entityId: usedEntityId,
      }).unwrap();
    } catch (e: any) {
      toast.error(e?.error?.message ?? "You can’t edit this comment.");
      throw e;
    }
  }

  async function onDelete(id: string) {
    if (!valid || !entityType) return;
    try {
      await deleteComment({ id, entityType, entityId: usedEntityId }).unwrap();
    } catch (e: any) {
      toast.error(e?.error?.message ?? "You can’t delete this comment.");
      throw e;
    }
  }

  async function onReact(id: string, action: "like" | "dislike" | "clear") {
    if (!valid || !entityType) return;
    await reactToComment({
      id,
      entityType,
      entityId: usedEntityId,
      action,
    }).unwrap();
  }

  const exampleEntityType = entityType || "post";
  const exampleEntityId = usedEntityId || ""; 

  const exampleUrl = `/comments/${exampleEntityType}`;

  if (!valid) {
    return (
      <div className={styles.wrap}>
        <h4 className={styles.title}>Comments</h4>
        <p className={styles.sub}>
          Missing entity params. Use a URL like <code>{exampleUrl}</code>.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.composer}>
        <CommentForm submitLabel="Post" onSubmit={onSubmitNew} />
      </div>

      <CommentsList
        data={data?.data ?? []}
        page={data?.meta?.page ?? page}
        limit={data?.meta?.limit ?? limit}
        totalCount={data?.meta?.totalCount ?? 0}
        totalPages={data?.meta?.totalPages ?? 1}
        sort={sort}
        loading={isLoading}
        fetching={isFetching}
        error={errorText}
        onRetry={() => refetch()}
        onSortChange={(s) => setQuery({ sort: s, page: 1 })}
        onPageChange={(p) => setQuery({ page: p })}
        onLimitChange={(l) => setQuery({ limit: l, page: 1 })}
        onEdit={onEdit}
        onDelete={onDelete}
        onReact={onReact}
        onReply={env.ENABLE_REPLIES ? onReply : undefined}
      />
    </div>
  );
}

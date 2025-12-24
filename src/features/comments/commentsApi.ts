import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/app/api/axiosBaseQuery";
import type {
  CommentDTO,
  CreateCommentBody,
  GetCommentsParams,
  PaginatedResponse,
  ReactionAction,
  ReactionResponse,
  UpdateCommentBody,
} from "./types";
import type { RootState } from "@/app/store";
import toast from "react-hot-toast";

function applyReactionOptimistic(
  comment: CommentDTO,
  action: ReactionAction
): {
  likeCount: number;
  dislikeCount: number;
  myReaction: CommentDTO["myReaction"];
} {
  const prev = comment.myReaction;

  let next: CommentDTO["myReaction"] = null;
  if (action === "like") {
    next = prev === "like" ? null : "like";
  } else if (action === "dislike") {
    next = prev === "dislike" ? null : "dislike";
  } else if (action === "clear") {
    next = null;
  }

  let likeCount = comment.likeCount;
  let dislikeCount = comment.dislikeCount;

  if (prev === "like") likeCount--;
  if (prev === "dislike") dislikeCount--;

  if (next === "like") likeCount++;
  if (next === "dislike") dislikeCount++;

  return {
    likeCount: Math.max(0, likeCount),
    dislikeCount: Math.max(0, dislikeCount),
    myReaction: next,
  };
}

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getComments: builder.query<
      PaginatedResponse<CommentDTO>,
      GetCommentsParams
    >({
      query: (params) => ({
        url: "/api/comments",
        method: "GET",
        params,
      }),

      transformResponse: (resp: any) => {
        const included = Array.isArray(resp?.includedReplies)
          ? resp.includedReplies
          : [];

        return {
          ...resp,
          data: [...(resp.data ?? []), ...included],
        } as PaginatedResponse<CommentDTO>;
      },

      providesTags: (_res, _err, arg) => [
        { type: "Comments", id: `${arg.entityType}:${arg.entityId}` },
      ],
    }),

    createComment: builder.mutation<CommentDTO, CreateCommentBody>({
      query: (body) => ({
        url: "/api/comments",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const ui = state.commentsUi;
        const isRoot = !body.parentId;
        const canOptimisticallyInsert =
          isRoot && ui.page === 1 && ui.sort === "newest";

        let patch: any | undefined;
        if (canOptimisticallyInsert) {
          patch = dispatch(
            commentsApi.util.updateQueryData(
              "getComments",
              {
                entityType: body.entityType,
                entityId: body.entityId,
                page: ui.page,
                limit: ui.limit,
                sort: ui.sort,
              },
              (draft) => {
                const me = state.auth.user;
                const temp: CommentDTO = {
                  _id: `temp-${Math.random().toString(16).slice(2)}`,
                  entityType: body.entityType,
                  entityId: body.entityId,
                  content: body.content,
                  parentId: body.parentId ?? null,
                  author: {
                    _id: me?._id ?? "me",
                    name: me?.name ?? "You",
                    avatarUrl: me?.avatarUrl,
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  likeCount: 0,
                  dislikeCount: 0,
                  myReaction: null,
                  canEdit: true,
                  canDelete: true,
                  replyCount: 0,
                };
                draft.data.unshift(temp);
                if (draft.meta) {
                  draft.meta.totalCount += 1;
                }
              }
            )
          );
        }

        try {
          await queryFulfilled;

          if (canOptimisticallyInsert && patch) {
            patch.undo();
          }
          dispatch(
            commentsApi.util.invalidateTags([
              { type: "Comments", id: `${body.entityType}:${body.entityId}` },
            ])
          );
          toast.success("Comment posted");
        } catch {
          patch?.undo();
          toast.error("Failed to post comment");
        }
      },
    }),

    updateComment: builder.mutation<
      CommentDTO,
      {
        id: string;
        body: UpdateCommentBody;
        entityType: string;
        entityId: string;
      }
    >({
      query: ({ id, body }) => ({
        url: `/api/comments/${id}`,
        method: "PATCH",
        data: body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const ui = state.commentsUi;

        const patch = dispatch(
          commentsApi.util.updateQueryData(
            "getComments",
            {
              entityType: arg.entityType,
              entityId: arg.entityId,
              page: ui.page,
              limit: ui.limit,
              sort: ui.sort,
            },
            (draft) => {
              
              let c = draft.data.find((x) => x._id === arg.id);
              if (c) {
                c.content = arg.body.content;
                c.updatedAt = new Date().toISOString();
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (e: any) {
          patch.undo();
          toast.error(e?.error?.message ?? "Failed to update comment");
        }
      },
    }),

    deleteComment: builder.mutation<
      { success: boolean; _id: string },
      { id: string; entityType: string; entityId: string }
    >({
      query: ({ id }) => ({
        url: `/api/comments/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const ui = state.commentsUi;

        const patch = dispatch(
          commentsApi.util.updateQueryData(
            "getComments",
            {
              entityType: arg.entityType,
              entityId: arg.entityId,
              page: ui.page,
              limit: ui.limit,
              sort: ui.sort,
            },
            (draft) => {
              draft.data = draft.data.filter((c) => c._id !== arg.id);
              if (draft.meta)
                draft.meta.totalCount = Math.max(0, draft.meta.totalCount - 1);
            }
          )
        );

        try {
          await queryFulfilled;

          toast.success("Comment deleted");
        } catch (e: any) {
          patch.undo();
          toast.error(e?.error?.message ?? "Failed to delete comment");
        }
      },
    }),

    reactToComment: builder.mutation<
      ReactionResponse,
      {
        id: string;
        entityType: string;
        entityId: string;
        action: ReactionAction;
      }
    >({
      query: ({ id, action }) => ({
        url: `/api/comments/${id}/reactions`,
        method: "POST",
        data: { action },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const ui = state.commentsUi;

        const patch = dispatch(
          commentsApi.util.updateQueryData(
            "getComments",
            {
              entityType: arg.entityType,
              entityId: arg.entityId,
              page: ui.page,
              limit: ui.limit,
              sort: ui.sort,
            },
            (draft) => {
              const c = draft.data.find((x) => x._id === arg.id);
              if (!c) return;
              const next = applyReactionOptimistic(c, arg.action);
              c.likeCount = next.likeCount;
              c.dislikeCount = next.dislikeCount;
              c.myReaction = next.myReaction;
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            commentsApi.util.updateQueryData(
              "getComments",

              {
                entityType: arg.entityType,
                entityId: arg.entityId,
                page: ui.page,
                limit: ui.limit,
                sort: ui.sort,
              },
              (draft) => {
                const c = draft.data.find((x) => x._id === arg.id);
                if (!c) return;
                c.likeCount = data.likeCount;
                c.dislikeCount = data.dislikeCount;
                if (typeof data.myReaction !== "undefined")
                  c.myReaction = data.myReaction ?? null;
              }
            )
          );
        } catch (e: any) {
          patch.undo();
          toast.error(e?.error?.message ?? "Reaction failed");
        }
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReactToCommentMutation,
} = commentsApi;

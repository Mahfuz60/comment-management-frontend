import { io, Socket } from "socket.io-client";
import { env } from "@/utils/env";
import type { AppDispatch } from "@/app/store";
import { commentsApi } from "./commentsApi";
import type { CommentDTO, ReactionResponse } from "./types";

let socket: Socket | null = null;

type DeletedPayload = { _id: string };

export function startCommentsSocket(dispatch: AppDispatch) {
  if (!env.ENABLE_SOCKET) return;
  if (socket) return;

  socket = io(env.SOCKET_URL, {
    withCredentials: true
  });

  socket.on("comment:created", (payload: CommentDTO) => {
    dispatch(commentsApi.util.invalidateTags([{ type: "Comments", id: `${payload.entityType}:${payload.entityId}` }]));
  });

  socket.on("comment:updated", (payload: CommentDTO) => {
    dispatch(commentsApi.util.invalidateTags([{ type: "Comments", id: `${payload.entityType}:${payload.entityId}` }]));
  });

  socket.on("comment:deleted", (_payload: DeletedPayload) => {
    dispatch(commentsApi.util.invalidateTags([{ type: "Comments" as any, id: "all" as any }]));
  });

  socket.on("comment:reaction", (_payload: ReactionResponse & { myReaction?: "like" | "dislike" | null }) => {
    dispatch(commentsApi.util.invalidateTags([{ type: "Comments" as any, id: "all" as any }]));
  });
}

export function stopCommentsSocket() {
  socket?.disconnect();
  socket = null;
}

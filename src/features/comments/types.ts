export type EntityType = "post" | "video" | "article" | string;

export type AuthorDTO = {
  _id: string;
  name: string;
  avatarUrl?: string | undefined;
};

export type Reaction = "like" | "dislike" | null;

export type CommentDTO = {
  _id: string;
  entityType: string;
  entityId: string;
  content: string;
  parentId: string | null;
  author: AuthorDTO;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  dislikeCount: number;
  myReaction: Reaction;
  canEdit: boolean;
  canDelete: boolean;
  replyCount?: number;
};

export type CommentsSort = "newest" | "mostLiked" | "mostDisliked";

export type PaginatedResponse<T> = {
  success: boolean;
  meta: { page: number; limit: number; totalPages: number; totalCount: number };
  data: T[];
  includedReplies?: T[];
};

export type GetCommentsParams = {
  entityType: string;
  entityId: string;
  page: number;
  limit: number;
  sort: CommentsSort;
  includeReplies?: boolean;
};

export type CreateCommentBody = {
  entityType: string;
  entityId: string;
  content: string;
  parentId?: string | null;
};

export type UpdateCommentBody = { content: string };

export type ReactionAction = "like" | "dislike" | "clear";

export type ReactionResponse = {
  _id: string;
  likeCount: number;
  dislikeCount: number;
  myReaction?: Reaction;
};

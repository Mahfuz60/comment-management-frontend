import React from "react";
import { Navigate, useParams } from "react-router-dom";

export function CommentsEntityRedirect() {
  const { entityType } = useParams();

  
  const fallbackId = "123";

  return (
    <Navigate
      to={`/comments/${encodeURIComponent(entityType ?? "post")}/${fallbackId}`}
      replace
    />
  );
}

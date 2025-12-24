import React, { useMemo, useState } from "react";
import styles from "./ReplyThread.module.scss";
import type { CommentDTO, ReactionAction } from "../types";
import { CommentItem } from "./CommentItem";

type Props = {
  comments: CommentDTO[];
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReact: (id: string, action: ReactionAction) => Promise<void>;
  onReply: (parentId: string, content: string) => Promise<void>;
};

type Node = CommentDTO & { children: Node[] };

function buildTree(comments: CommentDTO[]): Node[] {
  const map = new Map<string, Node>();
  const roots: Node[] = [];

  for (const c of comments) {
    map.set(c._id, { ...c, children: [] });
  }

  for (const n of map.values()) {
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(n);
    } else {
      roots.push(n);
    }
  }

  return roots;
}

type NodeProps = {
  node: Node;
  depth: number;
} & Omit<Props, "comments">;

function ThreadNode({ node, depth, ...props }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children.length > 0;
  const isRoot = depth === 0;

  return (
    <div className={[styles.node, isRoot ? styles.rootCard : ""].join(" ")}>
      <CommentItem
        comment={node}
        depth={depth}
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onReact={props.onReact}
        onReply={props.onReply}
        variant="minimal"
      />
      {hasChildren && (
        <div className={styles.nested}>
          <button
            className={styles.viewReplies}
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.replyIcon}
              style={{ transform: isOpen ? "scaleY(1)" : "scaleY(-1)" }}
            >
              <path d="M9 14l-4-4 4-4" />
              <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
            </svg>
            {isOpen
              ? "Hide replies"
              : `View ${node.children.length} ${
                  node.children.length === 1 ? "reply" : "replies"
                }`}
          </button>

          {isOpen && (
            <div className={styles.children}>
              {node.children.map((child) => (
                <ThreadNode
                  key={child._id}
                  node={child}
                  depth={depth + 1}
                  {...props}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ReplyThread({ comments, ...rest }: Props) {
  const tree = useMemo(() => buildTree(comments), [comments]);
  return (
    <div className={styles.wrap}>
      {tree.map((root) => (
        <ThreadNode key={root._id} node={root} depth={0} {...rest} />
      ))}
    </div>
  );
}

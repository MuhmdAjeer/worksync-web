import { Comment } from "@/generated/dto/comment";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistance, formatDistanceToNow } from "date-fns";
import { CommentDto } from "@/generated/dto/comment-dto";

interface IProps {
  comment: CommentDto;
}

const CommentCard: React.FC<IProps> = ({ comment }) => {
  const { user } = comment;
  return (
    <div className="flex w-full gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.profile_picture} alt={user.username} />
        <AvatarFallback className="text-xs">
          {user.username?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full ">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-medium">{user.username}</h1>
          {comment.created_at && (
            <p className="text-primary/30 text-xs hover:text-primary/70">
              {formatDistanceToNow(comment.created_at)}
            </p>
          )}
        </div>
        <div
          className="tiptap ProseMirror tableWrapper rounded-md border w-full px-2 py-2 "
          dangerouslySetInnerHTML={{ __html: comment.content }}
        ></div>
      </div>
    </div>
  );
};

export default CommentCard;

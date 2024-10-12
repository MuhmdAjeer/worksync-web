import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/user";
import { Textarea } from "@/components/ui/textarea";
import Tiptap from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { useAddComment } from "@/hooks/issue";

interface IProps {
  issueId: string;
}

const CommentInput: React.FC<IProps> = ({ issueId }) => {
  const { data: user } = useUser();
  const [content, setContent] = useState("");
  const { mutate: addComment, isPending } = useAddComment();

  const handleAddComment = () => {
    addComment({ issueId, data: { content } });
  };

  if (!user) return null;
  return (
    <div>
      <div className="flex w-full gap-2">
        <Avatar>
          <AvatarImage src={user.profile_picture} alt={user.username} />
          <AvatarFallback>
            {user.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <Tiptap
            className="h-24 !max-h-24 w-full"
            onChange={(v) => {
              setContent(v);
            }}
          />
          <div>
            <Button
              disabled={isPending || !content}
              onClick={handleAddComment}
              size="xs"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;

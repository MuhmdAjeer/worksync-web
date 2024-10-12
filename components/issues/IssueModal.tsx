import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IssueDto } from "@/generated/dto/issue-dto";
import CommentInput from "./comment/CommentInput";
import { useAddComment, useComments } from "@/hooks/issue";
import CommentCard from "./comment/CommentCard";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import CommentEditor from "./comment/CommentEditor";
import { useRouter } from "next/router";
import { format, formatDistanceToNow } from "date-fns";

import { Cross2Icon } from "@radix-ui/react-icons";

import { useProjectMembers } from "@/hooks/projects";
import IssueProperties from "./IssueProperties";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface IProps {
  issue: IssueDto;
  onOpenChange: (v: boolean) => void;
  open: boolean;
}

const IssueModal: React.FC<IProps> = (props) => {
  const { issue, onOpenChange, open } = props;

  const { data: comments } = useComments(issue.id);
  const { mutate: addComment } = useAddComment();

  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="min-w-[70%] px-6">
        <DialogHeader className="flex flex-row  justify-between">
          <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
          <div className="flex cursor-pointer gap-2 items-center text-muted-foreground">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(issue.id).then(() => {
                  toast("Link copied");
                });
              }}
              size="icon"
              variant="link"
            >
              <Copy className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => onOpenChange(!open)}
              size="icon"
              variant="link"
            >
              <Cross2Icon className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-3 h-full gap-2">
          <div className="col-span-2 h-full gap-4 flex flex-col">
            <div className="flex gap-2 flex-col">
              <h1 className="font-bold text-lg">Description</h1>

              <DialogDescription
                className="tiptap ProseMirror px-0"
                dangerouslySetInnerHTML={{
                  __html: issue.description ?? "Add a description",
                }}
              ></DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-lg">Activity</h1>
              <ScrollArea className="max-h-60 overflow-scroll">
                <div className="flex w-full pr-4 gap-2 flex-col">
                  {comments?.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                  <div ref={commentsRef} />
                </div>
              </ScrollArea>

              <CommentEditor
                handleSubmit={(value) => {
                  if (!value) return;
                  addComment({ issueId: issue.id, data: { content: value } });
                }}
              />
            </div>
          </div>
          <div>
            <IssueProperties issue={issue} />
            <div className="text-xs text-muted-foreground px-4 space-y-1 ">
              <p>Created at {format(issue.created_at!, "PPPp")}</p>
              <p>Updated {formatDistanceToNow(issue.updated_at!)} ago</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueModal;

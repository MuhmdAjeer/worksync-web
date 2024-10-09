import React from "react";
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
import { useComments } from "@/hooks/issue";
import CommentCard from "./comment/CommentCard";
import { ScrollArea } from "../ui/scroll-area";

interface IProps {
  issue: IssueDto;
  onOpenChange: (v: boolean) => void;
  open: boolean;
}

const IssueModal: React.FC<IProps> = (props) => {
  const { issue, onOpenChange, open } = props;

  const { data: comments } = useComments(issue.id);
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="min-w-[60%] px-6">
        <DialogHeader>
          <DialogTitle>{issue.title}</DialogTitle>
        </DialogHeader>
        <h1>Description</h1>
        <DialogDescription
          dangerouslySetInnerHTML={{ __html: issue.description ?? "" }}
        ></DialogDescription>
        <h1>Activity</h1>
        <ScrollArea className="max-h-80 pr-8">
          <div className="flex gap-2 flex-col">
            {comments?.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </ScrollArea>
        <CommentInput issueId={issue.id} />
      </DialogContent>
    </Dialog>
  );
};

export default IssueModal;

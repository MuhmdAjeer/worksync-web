import { UserDto } from "@/generated/dto/user-dto";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProjectMembers } from "@/hooks/projects";
import { useRouter } from "next/router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
interface IProps {
  userIds: string[] | string | null;
}

const ButtonAvatar: React.FC<IProps> = ({ userIds }) => {
  const { projectId } = useRouter().query;
  const { data: members } = useProjectMembers(projectId?.toString()!);
  const getUserDetail = (id: string) => {
    if (!members) return null;
    return members.find((m) => m.user.id === id)?.user;
  };
  if (!userIds) return null;

  if (Array.isArray(userIds)) {
    return userIds.map((id) => {
      const user = getUserDetail(id);
      if (!user) return null;

      return (
        <Tooltip delayDuration={100} key={user.id}>
          <TooltipTrigger asChild>
            <Avatar
              className={cn("size-6 border-[0.1px] border-primary-foreground ")}
            >
              <AvatarImage
                className="border border-1 border-white"
                src={user.profile_picture}
              />
              <AvatarFallback>
                {user.username?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.username}</p>
          </TooltipContent>
        </Tooltip>
      );
    });
  }

  const user = getUserDetail(userIds);
  if (!user) return null;
  return (
    <Tooltip delayDuration={100} key={user.id}>
      <TooltipTrigger asChild>
        <Avatar
          className={cn("size-6 border-[0.1px] border-primary-foreground ")}
        >
          <AvatarImage
            className="border border-1 border-white"
            src={user.profile_picture}
          />
          <AvatarFallback>
            {user.username?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p>{user.username}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ButtonAvatar;

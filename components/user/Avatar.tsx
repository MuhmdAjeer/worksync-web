import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserDto } from "@/generated/dto/user-dto";

interface IProps {
  src: string;
  className?: string;
}
const UserAvatar: FC<IProps> = ({ src, className }) => {
  return (
    <Avatar key={src}>
      <AvatarImage className={className} src={src} />
      {/* <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback> */}
    </Avatar>
  );
};

export default UserAvatar;

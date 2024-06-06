import { User } from "@/generated/dto/user";
import Image from "next/image";
import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IProps {
  user: User;
}
const UserAvatar: FC<IProps> = ({ user }) => {
  return (
    <Avatar key={user.id}>
      <AvatarImage src={user.profile_picture} />
      <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

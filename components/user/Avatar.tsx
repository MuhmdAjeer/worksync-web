import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserDto } from "@/generated/dto/user-dto";

interface IProps {
  user: UserDto;
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

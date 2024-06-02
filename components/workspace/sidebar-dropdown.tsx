import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import Typography from "../ui/Typography";
import { LogOut, PlusIcon, PlusSquare, Settings, User } from "lucide-react";
import { useWorkspace } from "@/hooks/workspace";
import Link from "next/link";
import { observer } from "mobx-react";

const WorkspaceSidebarDropdown = observer(() => {
  const handleLogout = () => {
    signOut();
  };
  const session = useSession();
  const { workspaces, currentWorkspace } = useWorkspace();
  return (
    <div className="flex justify-between gap-2 p-4 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex p-1 rounded w-full hover:bg-slate-200 gap-2 items-center">
          <div className="bg-custom-primary-dark h-6 w-6 rounded flex items-center justify-center">
            <span className="text-secondary text-xs ">
              {currentWorkspace?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <Typography variant="h6">{currentWorkspace?.name}</Typography>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-4" side="bottom">
          <DropdownMenuLabel className=" font-medium text-gray-500 text-xs">
            {session.data?.user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.values(workspaces ?? {}).map((workspace) => (
            <DropdownMenuItem key={workspace.id}>
              <Link href={`/${workspace.name}`} className="flex gap-2">
                <div className="bg-custom-primary-dark h-5 w-5 rounded flex items-center justify-center">
                  <span className="text-secondary text-xs">
                    {workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Typography variant="h6">{workspace.name}</Typography>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex gap-2 px-4">
            <PlusSquare className="h-4 w-4" />
            <p className="leading-5">Create workspace</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 px-4">
            <User className="h-4 w-4" />
            <p className="leading-5">My activity</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 px-4">
            <Settings className="h-4 w-4" />
            <p className="leading-5">Settings</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive flex gap-2 px-4"
          >
            <LogOut className="  h-4 w-4" />
            <p className="leading-5">Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="bg-custom-primary-dark h-6 w-6 rounded flex items-center justify-center">
            <span className="text-secondary text-xs ">
              {session.data?.user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem className="flex gap-2 px-4">
            <PlusSquare className="h-4 w-4" />
            <p className="leading-5">Create workspace</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 px-4">
            <User className="h-4 w-4" />
            <p className="leading-5">My activity</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 px-4">
            <Settings className="h-4 w-4" />
            <p className="leading-5">Settings</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive flex gap-2 px-4"
          >
            <LogOut className="  h-4 w-4" />
            <p className="leading-5">Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export default WorkspaceSidebarDropdown;

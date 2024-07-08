import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

const avatarStackVariants = cva("flex", {
  variants: {
    variant: {
      default: "gap-1",
      stack: "hover:space-x-1.5 -space-x-2.5 rtl:space-x-reverse",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        lg: "h-10 w-10 min-w-10 min-h-10",
        md: "h-8 w-8 min-w-8 min-h-8",
        sm: "h-5 w-5 min-w-5 min-h-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<VariantProps<typeof avatarVariants>, `size`>,
    VariantProps<typeof avatarStackVariants> {
  id: string;
  avatars: { url?: string; name: string }[];
  maxAvatarsAmount?: number;
}

function AvatarStack({
  id,
  className,
  avatars,
  variant,
  size,
  maxAvatarsAmount = 4,
  ...props
}: AvatarStackProps) {
  const limitedAvatars = avatars.slice(0, maxAvatarsAmount);
  return (
    <div className={cn(avatarStackVariants({ variant }), className)} {...props}>
      {limitedAvatars.slice(0, maxAvatarsAmount).map((avatar, index) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar>
              <AvatarImage src={avatar.url} />
              <AvatarFallback>
                {avatar.name
                  .split(" ")
                  .reduce((acc, subName) => acc + subName[0], "")}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{avatar.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {limitedAvatars.length < avatars.length && (
        <Avatar>
          <AvatarFallback className="text-primary">
            +{avatars.length - limitedAvatars.length}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export { AvatarStack };

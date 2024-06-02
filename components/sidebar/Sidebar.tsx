import Image from "next/image";
import React from "react";
import { BarChart2, BellDotIcon, Briefcase, Crown, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useAppRouter } from "@/hooks/router";
import { observer } from "mobx-react";

export type Props = {
  className?: string;
  width?: string | number;
  height?: string | number;
  color?: string;
};

export const SIDEBAR_MENU_ITEMS: {
  key: string;
  label: string;
  href: string;
  highlight: (pathname: string, baseUrl: string) => boolean;
  Icon: React.FC<Props>;
}[] = [
  {
    key: "home",
    label: "Home",
    href: ``,
    highlight: (pathname: string, baseUrl: string) => pathname === `${baseUrl}`,
    Icon: Home,
  },
  {
    key: "projects",
    label: "Projects",
    href: `/projects`,
    highlight: (pathname: string, baseUrl: string) =>
      pathname.includes(`${baseUrl}/projects`),
    Icon: Briefcase,
  },
  {
    key: "issues",
    label: "Issues",
    href: `/issues`,
    highlight: (pathname: string, baseUrl: string) =>
      pathname.includes(`${baseUrl}/issues`),
    Icon: QuestionMarkCircledIcon,
  },
  {
    key: "notifications",
    label: "Notifications",
    href: `/notifications`,
    highlight: (pathname: string, baseUrl: string) =>
      pathname.includes(`${baseUrl}/notifications`),
    Icon: BellDotIcon,
  },
];

const Sidebar = observer(() => {
  const { workspaceSlug } = useAppRouter();
  const router = useRouter();
  return (
    <div className="w-full cursor-pointer space-y-2 p-4">
      {SIDEBAR_MENU_ITEMS.map((link) => (
        <Link key={link.key} href={`/${workspaceSlug}${link.href}`}>
          <span className="my-1 block w-full">
            <div
              className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium outline-none ${
                link.highlight(router.asPath, `/${workspaceSlug}`)
                  ? "bg-custom-primary-dark/10 text-custom-primary-dark"
                  : "text-foreground hover:bg-foreground/5 focus:bg-foreground/50"
              }  `}
            >
              {<link.Icon className="h-4 w-4" />}
              <p className="leading-5">{link.label}</p>
            </div>
          </span>
        </Link>
      ))}
    </div>
  );
});

export default Sidebar;

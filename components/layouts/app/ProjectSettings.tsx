import { FC, ReactNode } from "react";
import { AppSideBar } from "./Sidebar";
import { Inter } from "next/font/google";
import WorkspaceWrapper from "@/lib/wrappers/workspace-wrapper";
import { observer } from "mobx-react";
import AuthWrapper from "@/lib/wrappers/auth-wrapper";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import MenuItem from "@/components/settings/MenuItem";

interface IProps {
  header?: ReactNode;
  children: ReactNode;
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const MenuItems = [
  {
    title: "General",
    link: "settings",
    highlight: (pathname: string, baseUrl: string) =>
      pathname === `${baseUrl}/settings`,
  },
  {
    title: "Members",
    link: "/settings/members",
    highlight: (pathname: string, baseUrl: string) =>
      pathname === `${baseUrl}/settings/members`,
  },
];

export const ProjectSettings: FC<IProps> = observer(({ header, children }) => {
  const pathname = usePathname();
  const { workspaceSlug, projectId } = useRouter().query;
  return (
    <AuthWrapper>
      <WorkspaceWrapper>
        <div className="relative flex h-screen overflow-hidden">
          <AppSideBar />

          <main
            style={{ boxShadow: "0px 2px 23px 2px rgba(0,0,0,0.05) inset" }}
            className="relative shadow-lg flex h-[calc(100%-2.5rem)] flex-col overflow-hidden w-full border mt-6 mr-5 rounded-lg  "
          >
            <div className="z-[15]">
              <div className="z-10 flex w-full items-center">
                <div className="block bg-custom-sidebar-background-100  py-4 pl-5 md:hidden">
                  {/* <SidebarHamburgerToggle /> */}
                </div>
                <div className="w-full border-b ">{header}</div>
              </div>
              {/* {mobileHeader && mobileHeader} */}
            </div>
            <div className="h-full w-full  overflow-hidden">
              <div className="relative h-full w-full flex overflow-x-hidden p-8 overflow-y-scroll">
                <div className="flex w-80 flex-col gap-6 px-5">
                  <h1 className="font-bold   text-sm text-primary/50">
                    SETTINGS
                  </h1>
                  <div className="flex w-full flex-col gap-1">
                    {MenuItems.map((item) => (
                      <Link
                        href={`/${workspaceSlug}/projects/${projectId}/${item.link}`}
                        key={item.title}
                      >
                        <MenuItem
                          isActive={item.highlight(
                            pathname,
                            `/${workspaceSlug}/projects/${projectId}`,
                          )}
                        >
                          {item.title}
                        </MenuItem>
                      </Link>
                    ))}
                  </div>
                </div>
                {children}
              </div>
            </div>
          </main>
        </div>
      </WorkspaceWrapper>
    </AuthWrapper>
  );
});

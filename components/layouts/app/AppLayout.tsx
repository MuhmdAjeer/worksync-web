import { FC, ReactNode } from "react";
import { AppSideBar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import WorkspaceWrapper from "@/lib/wrappers/workspace-wrapper";
import { observer } from "mobx-react";
import AuthWrapper from "@/lib/wrappers/auth-wrapper";

interface IProps {
  header?: ReactNode;
  children: ReactNode;
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const AppLayout: FC<IProps> = observer(({ header, children }) => {
  return (
    <AuthWrapper>
      <WorkspaceWrapper>
        <div className="relative flex h-screen w-full overflow-hidden">
          <AppSideBar />

          <main className="relative flex h-full w-full flex-col overflow-hidden ">
            <div className="z-[15]">
              <div className="z-10 flex w-full items-center">
                <div className="block bg-custom-sidebar-background-100  py-4 pl-5 md:hidden">
                  {/* <SidebarHamburgerToggle /> */}
                </div>
                <div className="w-full">{header}</div>
              </div>
              {/* {mobileHeader && mobileHeader} */}
            </div>
            <div className="h-full  w-[calc(100%-0.75rem)] border  rounded-lg mb-3 mr-3 overflow-hidden">
              <div className="relative h-full w-full overflow-x-hidden overflow-y-scroll">
                {children}
              </div>
            </div>
          </main>
        </div>
      </WorkspaceWrapper>
    </AuthWrapper>
  );
});

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
            <div className="h-full  overflow-hidden">
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

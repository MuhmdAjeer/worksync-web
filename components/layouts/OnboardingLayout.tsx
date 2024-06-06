import Sidebar from "@/components/sidebar/Sidebar";
import Typography from "@/components/ui/Typography";
import { Card } from "@/components/ui/card";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import React from "react";

const OnboardingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = useSession();
  return (
    <div className="p-20 min-h-screen ">
      <div className="flex items-center w-full justify-between">
        <Typography className="text-slate-800" variant="h1">
          Worksync+
        </Typography>
        <Typography variant="h4" affects="small">
          {session.data?.user.email}
        </Typography>
      </div>
      <Card className="mx-20 mt-8 h-full border border-black border-opacity-20 rounded-lg shadow-2xl">
        {/* {children} */}
        <div className="flex">
          <div className="w-1/5 ">
            <Sidebar />
          </div>
          <div className="flex-1 p-20">{children}</div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingLayout;

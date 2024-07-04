"use client";
import { observer } from "mobx-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const AuthWrapper = observer(({ children }: PropsWithChildren) => {
  const session = useSession();
  const router = useRouter();

  // if (!session.data?.user.username) {
  //   // router.push("/onboarding");
  //   return <></>;
  // }
  return children;
});

export default AuthWrapper;

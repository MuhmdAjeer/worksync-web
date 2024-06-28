"use client";
import { observer } from "mobx-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const AuthWrapper = observer(({ children }: PropsWithChildren) => {
  return children;
});

export default AuthWrapper;

import { useAppRouter } from "@/hooks/router";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect } from "react";

const StoreWrapper = observer(({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { setQuery } = useAppRouter();

  useEffect(() => {
    if (!router.query) return;
    if (!router.isReady) return;
    setQuery(router.query);
  }, [router.query, setQuery, router.isReady]);

  return children;
});

export default StoreWrapper;

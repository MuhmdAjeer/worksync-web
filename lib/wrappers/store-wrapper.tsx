import { useAppRouter } from "@/hooks/router";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect } from "react";

const StoreWrapper = observer(({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { setQuery } = useAppRouter();

  useEffect(() => {
    console.log(router.query);

    if (!router.query) return;
    setQuery(router.query);
  }, [router.query, setQuery]);

  return children;
});

export default StoreWrapper;

import { useContext } from "react";
import { StoreContext } from "@/lib/store-context";
import { IRouterStore } from "@/lib/store/router.store";

export const useAppRouter = (): IRouterStore => {
  const context = useContext(StoreContext);
  if (context === undefined)
    throw new Error("useAppRouter must be used within StoreProvider");
  return context.routerStore;
};

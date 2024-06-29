import { useContext } from "react";
import { StoreContext } from "@/lib/store-context";
import { IWorkspaceRoot } from "@/lib/store/workspace.store";

export const useWorkspaceStore = (): IWorkspaceRoot => {
  const context = useContext(StoreContext);
  if (context === undefined)
    throw new Error("useWorkspace must be used within StoreProvider");
  return context.workspaceStore;
};

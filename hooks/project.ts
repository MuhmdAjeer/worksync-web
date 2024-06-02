import { useContext } from "react";
import { StoreContext } from "@/lib/store-context";
import { IProjectStore } from "@/lib/store/project.store";

export const useProject = (): IProjectStore => {
  const context = useContext(StoreContext);
  if (context === undefined)
    throw new Error("useProject must be used within StoreProvider");
  return context.projectStore;
};

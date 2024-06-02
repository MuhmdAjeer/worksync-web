import { enableStaticRendering } from "mobx-react";
import { WorkspaceRootStore } from "./workspace.store";
import { RouterStore } from "./router.store";
import { ProjectStore } from "./project.store";

enableStaticRendering(typeof window === "undefined");

export interface IRootStore {
  workspaceStore: WorkspaceRootStore;
  routerStore: RouterStore;
  projectStore: ProjectStore;
}

export class RootStore implements IRootStore {
  workspaceStore: WorkspaceRootStore;
  routerStore: RouterStore;
  projectStore: ProjectStore;
  constructor() {
    this.routerStore = new RouterStore();
    this.workspaceStore = new WorkspaceRootStore(this);
    this.projectStore = new ProjectStore(this);
  }
}

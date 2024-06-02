import { OnboardDto } from "@/generated/dto/onboard-dto";
import { Workspace } from "@/generated/dto/workspace";
import { WorkspaceService } from "@/services/workspace.service";
import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { RootStore } from "./root.store";
import set from "lodash/set";
export interface IWorkspaceRoot {
  currentWorkspace: Workspace | null;
  workspaces: Record<string, Workspace>;
  onboardUser: (data: OnboardDto) => Promise<Workspace>;
  fetchMyWorkspaces: () => Promise<Workspace[]>;
}
export class WorkspaceRootStore implements IWorkspaceRoot {
  workspaces: Record<string, Workspace> = {};
  workspaceService: WorkspaceService;
  router;
  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      currentWorkspace: computed,
      workspaces: observable,
      onboardUser: action,
      fetchMyWorkspaces: action,
    });
    this.workspaceService = new WorkspaceService();
    this.router = _rootStore.routerStore;
  }

  get currentWorkspace() {
    const workspaceSlug = this.router.workspaceSlug;
    if (!workspaceSlug) return null;
    const workspace = Object.values(this.workspaces ?? {}).find(
      (x) => x.name === workspaceSlug
    );
    return workspace || null;
  }

  onboardUser = async (data: OnboardDto) =>
    await this.workspaceService.onboardUser(data).then((response) => {
      return response;
    });

  fetchMyWorkspaces = async () =>
    await this.workspaceService.fetchMyWorkspaces().then((response) => {
      console.log({ workspaces: response });
      try {
        runInAction(() => {
          response.forEach((workspace) => {
            set(this.workspaces, [workspace.id], workspace);
          });
        });
      } catch (error) {
        console.log(error);
      }
      return response;
    });
}

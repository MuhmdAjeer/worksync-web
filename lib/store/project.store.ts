import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { ProjectService } from "@/services/project.service";
import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import set from "lodash/set";
import { RootStore } from "./root.store";
import { computedFn } from "mobx-utils";
import { ProjectDto as Project } from "@/generated/dto/project-dto";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";
export interface IProjectStore {
  loader: boolean;
  projectMap: {
    [projectId: string]: Project; // projectId: project Info
  };
  projects: Project[];
  createProject: (data: CreateProjectDto) => Promise<Project>;
  fetchProjects: (id: string) => Promise<Project[]>;
  workspaceProjects: Project[];
  currentProject: Project | null;
  getProjectById: (id: string) => Project;
  // stateMap:Record<string,IssueStateDto>
  // projectIssueStates: IssueStateDto[];
}

export class ProjectStore implements IProjectStore {
  projectMap: {
    [projectId: string]: Project;
  } = {};
  loader: boolean = false;
  projectService;
  rootStore: RootStore;
  router;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      projectMap: observable,
      createProject: action,
      loader: observable.ref,
      fetchProjects: action,
      projects: computed,
      workspaceProjects: computed,
      currentProject: computed,
    });
    this.projectService = new ProjectService();
    this.rootStore = _rootStore;
    this.router = _rootStore.routerStore;
  }

  createProject = async (data: CreateProjectDto) => {
    try {
      const response = await this.projectService.createProject(
        this.router.workspaceSlug!,
        data
      );
      runInAction(() => {
        set(this.projectMap, [response.id], response);
      });
      return response;
    } catch (error) {
      console.log("Failed to create project from project store");
      throw error;
    }
  };

  fetchProjects = async (workspaceId: string) => {
    try {
      const response = await this.projectService.fetchWorkspaceProjects(
        workspaceId
      );
      runInAction(() => {
        response.forEach((project) => {
          set(this.projectMap, [project.id], project);
        });
      });
      return response;
    } catch (error) {
      console.log("Failed to fetch projects from store");
      throw error;
    }
  };

  get workspaceProjects() {
    const workspace = this.rootStore.workspaceStore.currentWorkspace;
    const projects = Object.values(this.projectMap).filter(
      (p) => p.workspace.id === workspace?.id
    );
    console.log({ xcv: projects });

    return projects;
  }

  get currentProject() {
    const projectId = this.router.projectId;
    if (!projectId) return null;
    const project = this.projectMap[projectId] || null;
    return project || null;
  }

  getProjectById = computedFn((id: string) => {
    const project = this.projectMap[id];
    return project;
  });

  get projects() {
    return Object.values(this.projectMap ?? {});
  }
}

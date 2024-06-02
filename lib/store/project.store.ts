import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { Project } from "@/generated/dto/project";
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
export interface IProjectStore {
  loader: boolean;
  projectMap: {
    [projectId: string]: Project; // projectId: project Info
  };
  projects: Project[];
  createProject: (data: CreateProjectDto) => Promise<Project>;
  fetchProjects: (id: string) => Promise<Project[]>;
  workspaceProjects: Project[];
}

export class ProjectStore implements IProjectStore {
  projectMap: {
    [projectId: string]: Project;
  } = {};
  loader: boolean = false;
  projectService;
  rootStore: RootStore;

  constructor(_rootStore: RootStore) {
    makeObservable(this, {
      projectMap: observable,
      createProject: action,
      loader: observable.ref,
      fetchProjects: action,
      projects: computed,
      workspaceProjects: computed,
    });
    this.projectService = new ProjectService();
    this.rootStore = _rootStore;
    autorun(() => console.log("43242", this.workspaceProjects));
  }

  createProject = async (data: CreateProjectDto) => {
    try {
      const response = await this.projectService.createProject(data);
      runInAction(() => {
        set(this.projectMap, [response.id], response);
      });
      return response;
    } catch (error) {
      console.log("Failed to create project from project store");
      throw error;
    }
  };

  fetchProjects = async (id: string) => {
    try {
      const response = await this.projectService.fetchProjects(id);
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

  
  get projects() {
    return Object.values(this.projectMap ?? {});
  }
}

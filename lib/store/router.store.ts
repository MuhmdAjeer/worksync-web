import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { ParsedUrlQuery } from "querystring";

export interface IRouterStore {
  workspaceSlug: string | undefined;
  query: ParsedUrlQuery;
  setQuery: (query: ParsedUrlQuery) => void;
}

export class RouterStore implements IRouterStore {
  query: ParsedUrlQuery = {};
  constructor() {
    makeObservable(this, {
      query: observable,
      setQuery: action.bound,
      workspaceSlug: computed,
    });
  }
  setQuery = (query: ParsedUrlQuery) => {
    runInAction(() => {
      this.query = query;
    });
  };

  get workspaceSlug() {
    return this.query?.workspaceSlug?.toString();
  }
}

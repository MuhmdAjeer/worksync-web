export interface OnboardingWorkspace {
  name: string;
  slug: string;
  members: Member[];
}

export interface Member {
  email: string;
  role: string;
}

export enum EUserProjectRoles {
  GUEST = 5,
  MEMBER = 10,
  ADMIN = 15,
}

export enum EUserWorkspaceRoles {
  GUEST = 5,
  MEMBER = 10,
  ADMIN = 15,
}


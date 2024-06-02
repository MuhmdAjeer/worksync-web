export interface OnboardingWorkspace {
  name: string;
  slug: string;
  members: Member[];
}

export interface Member {
  email: string;
  role: string;
}

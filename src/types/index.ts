export interface Connection {
  id: string;
  name: string;
  url: string;
  pat: string;
  createdAt: string;
}

export interface AzureDevOpsProject {
  id: string;
  name: string;
  description?: string;
  url: string;
  state: string;
  visibility: string;
  lastUpdateTime?: string;
}

export interface ProjectsResponse {
  value: AzureDevOpsProject[];
  count: number;
}

export interface ConnectionWithProjects {
  connection: Connection;
  projects: AzureDevOpsProject[];
  loading: boolean;
  error: string | null;
}

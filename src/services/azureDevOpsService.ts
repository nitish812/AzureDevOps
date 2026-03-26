import type { AzureDevOpsProject, ProjectsResponse } from '../types';

function buildAuthHeader(pat: string): string {
  const token = btoa(`:${pat}`);
  return `Basic ${token}`;
}

function buildApiUrl(baseUrl: string, path: string): string {
  const normalized = baseUrl.replace(/\/$/, '');
  return `${normalized}/${path}`;
}

export async function fetchProjects(
  url: string,
  pat: string
): Promise<AzureDevOpsProject[]> {
  const headers = {
    Authorization: buildAuthHeader(pat),
    'Content-Type': 'application/json',
  };

  const all: AzureDevOpsProject[] = [];
  let continuationToken: string | null = null;

  do {
    const query = continuationToken
      ? `_apis/projects?api-version=7.0&continuationToken=${encodeURIComponent(continuationToken)}`
      : '_apis/projects?api-version=7.0';

    const apiUrl = buildApiUrl(url, query);
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          'Authentication failed. Please check your Personal Access Token.'
        );
      }
      if (response.status === 404) {
        throw new Error(
          'Organization not found. Please check the Azure DevOps URL.'
        );
      }
      throw new Error(
        `Failed to fetch projects: ${response.status} ${response.statusText}`
      );
    }

    const data: ProjectsResponse = await response.json();
    all.push(...data.value);

    continuationToken =
      response.headers.get('x-ms-continuationtoken') ?? null;
  } while (continuationToken);

  return all;
}

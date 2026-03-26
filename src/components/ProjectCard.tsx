import type { AzureDevOpsProject } from '../types';

interface ProjectCardProps {
  project: AzureDevOpsProject;
  organizationUrl: string;
}

export function ProjectCard({ project, organizationUrl }: ProjectCardProps) {
  const projectUrl = `${organizationUrl}/${encodeURIComponent(project.name)}`;

  const stateColor: Record<string, string> = {
    wellFormed: '#107c10',
    createPending: '#ffb900',
    deleting: '#d13438',
    new: '#0078d4',
    unchanged: '#107c10',
  };

  const color = stateColor[project.state] ?? '#605e5c';

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-icon">
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div className="project-info">
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-name"
          >
            {project.name}
          </a>
          <span
            className="project-state"
            style={{ color }}
          >
            ● {project.state}
          </span>
        </div>
        <span
          className={`project-visibility ${project.visibility.toLowerCase()}`}
        >
          {project.visibility}
        </span>
      </div>
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      {project.lastUpdateTime && (
        <p className="project-updated">
          Last updated:{' '}
          {new Date(project.lastUpdateTime).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

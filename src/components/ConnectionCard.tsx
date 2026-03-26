import { useEffect, useState } from 'react';
import type { Connection, AzureDevOpsProject } from '../types';
import { fetchProjects } from '../services/azureDevOpsService';
import { ProjectCard } from './ProjectCard';

interface ConnectionCardProps {
  connection: Connection;
  onRemove: (id: string) => void;
}

export function ConnectionCard({ connection, onRemove }: ConnectionCardProps) {
  const [projects, setProjects] = useState<AzureDevOpsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProjects(connection.url, connection.pat);
        if (!cancelled) setProjects(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [connection.url, connection.pat, retryCount]);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="connection-card">
      <div className="connection-card-header">
        <div className="connection-title">
          <span className="connection-dot" />
          <h2>{connection.name}</h2>
          <a
            href={connection.url}
            target="_blank"
            rel="noopener noreferrer"
            className="connection-url"
          >
            {connection.url}
          </a>
        </div>
        <div className="connection-actions">
          {!loading && !error && (
            <span className="project-count">{projects.length} projects</span>
          )}
          <button
            className="btn-icon"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '▶' : '▼'}
          </button>
          <button
            className="btn-icon btn-danger"
            onClick={() => onRemove(connection.id)}
            aria-label="Remove connection"
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="connection-card-body">
          {loading && (
            <div className="loading-spinner">
              <span className="spinner" /> Loading projects…
            </div>
          )}

          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button
                className="btn-retry"
                onClick={() => setRetryCount((c) => c + 1)}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <p className="no-projects">No projects found in this organization.</p>
          )}

          {!loading && !error && projects.length > 0 && (
            <>
              <div className="search-bar">
                <input
                  type="search"
                  placeholder="Filter projects…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {filtered.length === 0 ? (
                <p className="no-projects">No projects match your filter.</p>
              ) : (
                <div className="projects-grid">
                  {filtered.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      organizationUrl={connection.url}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

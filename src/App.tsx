import { useState, useEffect } from 'react';
import type { Connection } from './types';
import { ConnectionForm } from './components/ConnectionForm';
import { ConnectionCard } from './components/ConnectionCard';
import './App.css';

const STORAGE_KEY = 'ado-dashboard-connections';

function loadConnections(): Connection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Connection[]) : [];
  } catch {
    return [];
  }
}

function saveConnections(connections: Connection[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
}

function App() {
  const [connections, setConnections] = useState<Connection[]>(loadConnections);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    saveConnections(connections);
  }, [connections]);

  function handleAdd(connection: Connection) {
    setConnections((prev) => [...prev, connection]);
    setShowForm(false);
  }

  function handleRemove(id: string) {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <svg
              className="ado-logo"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M29.432 4.786L24.388.25v.004L24.384.25 17.05 6.898v.001L9.256.625l-9.27 4.4v21.97l9.27 4.38 8.22-7.785 7.022 2.674V4.786h-.001l-.001-.001zM9.256 23.88l-6.27-2.962V8.036l6.27 2.964v12.88zm.896-13.2L4.9 7.814l4.36-2.068 5.15 4.314-4.258.62zm7.898 11.19l-5.9 5.59V13.24l5.9-.856v9.486zm0-10.88l-5.9.858V8.64l5.9-5.582v8.932z"
                fill="currentColor"
              />
            </svg>
            <h1>Azure DevOps Dashboard</h1>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? '✕ Cancel' : '+ Add Connection'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {showForm && (
          <div className="form-overlay">
            <ConnectionForm onAdd={handleAdd} />
          </div>
        )}

        {connections.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h2>No connections yet</h2>
            <p>
              Add an Azure DevOps organization by providing the URL and a
              Personal Access Token.
            </p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Add Connection
            </button>
          </div>
        )}

        <div className="connections-list">
          {connections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Azure DevOps Dashboard — connections are stored locally in your
          browser.
        </p>
      </footer>
    </div>
  );
}

export default App;

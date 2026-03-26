import { useState } from 'react';
import type { Connection } from '../types';

interface ConnectionFormProps {
  onAdd: (connection: Connection) => void;
}

export function ConnectionForm({ onAdd }: ConnectionFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [pat, setPat] = useState('');
  const [showPat, setShowPat] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedUrl = url.trim().replace(/\/$/, '');
    const trimmedPat = pat.trim();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter a display name for this connection.');
      return;
    }
    if (!trimmedUrl) {
      setError('Please enter the Azure DevOps organization URL.');
      return;
    }
    if (!trimmedUrl.startsWith('https://')) {
      setError('URL must start with https://');
      return;
    }
    if (!trimmedPat) {
      setError('Please enter your Personal Access Token.');
      return;
    }

    const connection: Connection = {
      id: crypto.randomUUID(),
      name: trimmedName,
      url: trimmedUrl,
      pat: trimmedPat,
      createdAt: new Date().toISOString(),
    };

    onAdd(connection);
    setName('');
    setUrl('');
    setPat('');
  }

  return (
    <form className="connection-form" onSubmit={handleSubmit}>
      <h2>Add Azure DevOps Connection</h2>
      <div className="form-group">
        <label htmlFor="conn-name">Display Name</label>
        <input
          id="conn-name"
          type="text"
          placeholder="e.g. My Organization"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="conn-url">Organization URL</label>
        <input
          id="conn-url"
          type="url"
          placeholder="https://dev.azure.com/your-organization"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="conn-pat">Personal Access Token</label>
        <div className="pat-input-wrapper">
          <input
            id="conn-pat"
            type={showPat ? 'text' : 'password'}
            placeholder="Enter your PAT"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-pat-btn"
            onClick={() => setShowPat((prev) => !prev)}
            aria-label={showPat ? 'Hide token' : 'Show token'}
          >
            {showPat ? '🙈' : '👁️'}
          </button>
        </div>
        <small className="form-hint">
          Requires <em>Read</em> access to Projects scope.
        </small>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn-primary">
        Connect
      </button>
    </form>
  );
}

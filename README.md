# Azure DevOps Dashboard

A centralized web dashboard to manage and browse multiple Azure DevOps organizations in one place.

## Features

- **Multiple connections** – Add as many Azure DevOps organizations as you need
- **URL + PAT authentication** – Connect using your organization URL and a Personal Access Token
- **Project browser** – See all projects for each connected organization in a responsive grid
- **Filter projects** – Quickly find a project with the per-connection search bar
- **Collapsible panels** – Expand or collapse each organization's project list
- **Persistent connections** – Connections are saved to browser `localStorage` so they survive page reloads
- **Retry on error** – If a connection fails, a retry button is shown inline

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- An [Azure DevOps](https://dev.azure.com) account with at least one organization

### Install & Run

```bash
npm install
npm run dev
```

Then open <http://localhost:5173> in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Adding a Connection

1. Click **+ Add Connection** in the top-right corner.
2. Enter a **Display Name** (e.g. "My Org").
3. Enter your **Organization URL** (e.g. `https://dev.azure.com/my-org`).
4. Enter a **Personal Access Token** — the token needs at least *Read* access to the **Project and Team** scope.
5. Click **Connect**. The dashboard will immediately fetch and display your projects.

### Creating a Personal Access Token

1. Go to `https://dev.azure.com/<your-org>/_usersSettings/tokens`
2. Click **+ New Token**
3. Under **Scopes**, select **Project and Team → Read**
4. Copy the generated token into the dashboard form

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for bundling
- Azure DevOps REST API v7.0

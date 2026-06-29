# rqsh-monorepo

This is the monorepo workspace for rqsh, an interactive terminal-based HTTP client built for developers.

## Repository Structure

The monorepo contains the following workspace applications:

* **apps/cli**: The request-shell CLI terminal application built with React and Ink.
* **apps/web**: The Next.js landing page and documentation website.

## Getting Started

### Installation

Clone the repository and install all workspace dependencies:

```bash
npm install
```

### Script Commands

You can run commands from the root directory to manage the workspaces:

* **CLI Dev Server:** `npm run dev:cli`
* **CLI Production Build:** `npm run build:cli`
* **CLI Test Suite:** `npm run test:cli`
* **Web Dev Server:** `npm run dev:web`
* **Web Production Build:** `npm run build:web`

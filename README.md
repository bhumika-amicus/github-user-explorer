# GitHub Users Explorer

A modern, responsive single-page web application to search, filter, and explore GitHub users and detailed profile statistics using the GitHub REST API.

---

## Setup & Running Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd github-user-explorer
   ```

2. **Serve the Application**:
   Because the project uses standard ES Modules (`import`/`export`), open the workspace using any local HTTP server:
   - **VS Code**: Right-click `index.html` $\rightarrow$ **Open with Live Server**.
   - **Python**:
     ```bash
     python -m http.server 8000
     ```
     Then open `http://localhost:8000`.
   - **Node.js**:
     ```bash
     npx serve .
     ```

---

## Overview of Project Parts

- **`index.html`**: Main dashboard view containing the filter toolbar, user counter, card container, and HTML5 `<template>` for user cards.
- **`details.html`**: Detailed user view displaying profile header, bio, stats, top 5 followers, top 5 repositories, and a back button.
- **`css/styles.css`**: Complete styling system providing GitHub-themed aesthetics, responsive flex/grid layouts, and shimmer skeleton loading animations.
- **`js/api.js`**: Network service module handling asynchronous `fetch()` requests to `https://api.github.com` with HTTP status validation (`response.ok`).
- **`js/users.js`**: Main page controller handling data transformation (`transformUsers`), input validation/sanitization, client-side pagination, and URL state synchronization (`minLen` & `page`).
- **`js/details.js`**: Details page controller extracting URL parameters and performing parallel data fetching (`Promise.all`) for profile, followers, and repositories.
- **`js/ui.js`**: UI rendering module responsible for DOM manipulations, template cloning, skeleton loading toggles, and dynamic pagination controls.

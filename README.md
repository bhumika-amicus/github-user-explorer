# GitHub Users Explorer (TypeScript Migration)

A responsive single-page web application to search, filter, and explore GitHub users and detailed profile statistics, migrated from JavaScript to TypeScript.

---

## 🛠️ Setup & Running Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd github-user-explorer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   Run the TypeScript compiler to build `.ts` source files from `src/` into output `.js` files in `dist/`:
   ```bash
   npx tsc
   ```

4. **Serve the Application**:
   Open the root directory using any local web server:
   - **VS Code**: Right-click `index.html` → **Open with Live Server**.
   - **Node.js**:
     ```bash
     npx serve .
     ```
   Then open `http://localhost:3000` (or the port provided by your server).

---

## ⚙️ TypeScript Configuration (`tsconfig.json`)

The project uses `tsconfig.json` to control how TypeScript checks and compiles our code:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### Key Settings Explained:
- **`rootDir: "./src"`**: Tells TypeScript where all our source `.ts` files live.
- **`outDir: "./dist"`**: Tells TypeScript where to save the generated `.js` files after compilation.
- **`strict: true`**: Turns on all strict type-checking flags to catch potential runtime bugs at build time.
- **`noImplicitAny: true`**: Prevents variables or parameters from defaulting to `any` if their type isn't specified.

---

## 📂 Project Structure

```text
github-user-explorer/
├── dist/                  # Generated JavaScript files (output from tsc)
│   ├── api.js
│   ├── details.js
│   ├── ui.js
│   └── users.js
├── src/                   # TypeScript source code
│   ├── api.ts
│   ├── details.ts
│   ├── types.ts           # Centralized TypeScript interfaces
│   ├── ui.ts
│   └── users.ts
├── screenshots/           # Application & compiler output screenshots
│   └── .gitkeep
├── css/
│   └── styles.css
├── index.html             # Main list view (loads ./dist/users.js)
├── details.html           # User details view (loads ./dist/details.js)
├── tsconfig.json          # TypeScript compiler configuration
├── package.json           # Node project configuration
└── README.md
```

---

## 📌 Task 1: Project Setup & TS Migration Insights

When running `npx tsc` for the first time with `strict: true` and `noImplicitAny: true`, TypeScript pointed out **74 errors** across our JavaScript files. Here is what we learned from them:

### Initial Compiler Run Overview
When `npx tsc` was executed, the compiler evaluated all source files against strict typing rules and flagged missing type annotations, unsafe null accesses, and invalid DOM property accesses.

---

### 1. Implicit `any` Types (`TS7006`)
- **Problem:** Parameters like `username` in `fetchUserProfile(username)` had no specified type.
- **Why it matters:** JavaScript allows passing anything, but TypeScript requires us to explicitly state expected types (e.g. `username: string`).

![Implicit any error screenshot](./screenshots/task1_implicit_any_error.png)

---

### 2. Possible `null` Values (`TS18047` / `TS2531`)
- **Problem:** DOM selections like `document.querySelector('#users-container')` might return `null` if the element isn't in the HTML.
- **Why it matters:** Accessing `.innerHTML` on `null` crashes the app. TypeScript forces us to add null safety checks (`if (container) ...` or optional chaining `?.`).

![Possible null value error screenshot](./screenshots/task1_null_check_error.png)

---

### 3. Specific DOM Element Types (`TS2339`)
- **Problem:** `document.querySelector('#min-login-length')` returns a generic `Element`, which does not have a `.value` property.
- **Why it matters:** Only `HTMLInputElement` has `.value`. We must cast DOM elements to their specific HTML types (e.g. `as HTMLInputElement`).

![DOM element casting error screenshot](./screenshots/task1_dom_type_error.png)

---

## 📌 Task 2: Data Interfaces & Types

All API response shapes are centralized inside `src/types.ts` to ensure type safety across the entire application:

### Interfaces Overview:
- **`GitHubUser`**: Represents a user profile object returned by GitHub API (`/users` and `/users/{username}`). Includes nullable/optional fields like `name`, `bio`, and `followers`.
- **`GitHubFollower`**: Represents a follower summary object (`login`, `id`, `avatar_url`, `html_url`).
- **`GitHubRepo`**: Represents a repository summary object (`name`, `stargazers_count`, `description`, etc.).

```typescript
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name?: string | null;
    public_repos?: number;
    followers?: number;
    following?: number;
    bio?: string | null;
}

export interface GitHubFollower {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
}
```

---

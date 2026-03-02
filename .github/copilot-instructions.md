# Copilot Instructions for SetDown

## Build, Test, and Lint Commands

- **Build (Frontend):**
  - `npm run build` (TypeScript + Vite)
- **Dev Server:**
  - `npm run dev` (Starts Vite dev server)
- **Preview:**
  - `npm run preview` (Preview built frontend)
- **Tauri (Desktop App):**
  - `npm run tauri` (Runs Tauri commands)
- **Rust Backend:**
  - Build via Tauri (`npm run tauri`), Rust config in `src-tauri/Cargo.toml`
- **Lint/Test:**
  - No explicit lint/test scripts found in package.json or codebase. Add these if needed for future maintainability.

## High-Level Architecture

- **Frontend:**
  - React + TypeScript, entry point: `src/main.tsx`, main app: `src/App.tsx`
  - Vite for bundling and dev server (`vite.config.ts`)
  - Static assets in `public/`
- **Desktop Integration:**
  - Tauri for native desktop features, config in `src-tauri/tauri.conf.json`
  - Rust backend in `src-tauri/` (main logic in Rust, exposed via Tauri commands)
  - Communication between frontend and backend via `@tauri-apps/api` (see `invoke` usage in `App.tsx`)

## Key Conventions

- **Tauri Command Pattern:**
  - Frontend calls backend Rust functions using `invoke` from `@tauri-apps/api/core`.
- **Port Usage:**
  - Vite dev server runs on port 1420 (see `vite.config.ts` and `tauri.conf.json`).
- **Ignored Directories:**
  - Vite is configured to ignore watching changes in `src-tauri/`.
- **No Test/Lint Setup:**
  - No test or lint scripts are present; add these for future development.

## Integration with Other AI Assistant Configs

- No other AI assistant config files (Claude, Cursor, Codex, Windsurf, Aider, Cline) detected in this repository.

---

This file summarizes build commands, architecture, and conventions for Copilot and other AI tools. Would you like to adjust anything or add coverage for areas I may have missed (e.g., test/lint setup, more backend details)?

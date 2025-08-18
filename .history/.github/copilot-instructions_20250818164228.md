# Copilot Instructions for insta-vertical-stories

This project is a minimal web UI that mimics Instagram's vertical stories with a glassmorphism aesthetic. It uses vanilla HTML, CSS, and JavaScript, with Vite for development and build tooling.

## Architecture Overview
- **Single-page app**: All UI is rendered from `index.html`, styled via `style.css`, and interactive via `script.js`.
- **Glassmorphism**: Core visual style is defined in CSS variables in `style.css`. Adjust these for color, blur, and spacing changes.
- **Demo Data**: Stories are hardcoded in `script.js`. Replace or extend with your own data source as needed.
- **No framework**: The codebase is intentionally framework-free for simplicity and fast prototyping.

## Developer Workflows
- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (hot reload via Vite)
- **Build for production**: `npm run build` (outputs to `dist/`)
- **Preview production build**: `npm run preview`
- **Linting/Formatting**: ESLint and Prettier configs are present, but minimal. Use your editor's integration or run manually if needed.

## Project-Specific Patterns
- **Design tokens**: All major style variables are in `:root` in `style.css`. Change these for global design updates.
- **Story rendering**: Stories are rendered and managed in `script.js`. UI logic is simple and imperative.
- **Customization**: Add new UI components directly in `index.html` and style in `style.css`.
- **Extensibility**: You can migrate to a JS framework later; Vite will support this transition.

## Key Files
- `index.html`: Main HTML structure and entry point.
- `style.css`: Glassmorphism styles and design tokens.
- `script.js`: Demo story logic and interactions.
- `package.json`: Vite config and scripts.

## External Dependencies
- **Vite**: Used for dev server, build, and preview. No other major dependencies.

## Example: Adding a New Story
1. Add story data to the array/object in `script.js`.
2. Update rendering logic if needed.
3. Adjust styles in `style.css` for new visual effects.

---

If any conventions or workflows are unclear, please provide feedback so this guide can be improved.

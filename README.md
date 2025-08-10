# insta-vertical-stories

A small, self-contained web UI that experiments with an Instagram-like vertical stories layout and a glassmorphism aesthetic.

## Quick start

- Prerequisites: Node.js 18+
- Install dependencies:
  
  ```bash
  npm install
  ```

- Start a local dev server with hot reload:
  
  ```bash
  npm run dev
  ```

- Build for production (outputs to `dist/`):
  
  ```bash
  npm run build
  ```

- Preview the production build locally:
  
  ```bash
  npm run preview
  ```

## Project structure

```
/workspace
├─ index.html            # Main HTML file
├─ style.css             # Glassmorphism styles using CSS variables
├─ script.js             # JS to render demo stories and interactions
├─ .eslintrc.json        # Minimal lint config
├─ .prettierrc           # Code formatting config
├─ .prettierignore       # Formatting ignore list
├─ package.json          # Dev/build tooling (Vite)
└─ LICENSE               # License (MIT)
```

## Customization

- Tweak design tokens in `:root` inside `style.css` to change colors, blur, spacing.
- Replace demo stories in `script.js` with data from your own source or API.
- Extend the layout by adding components to `index.html` and corresponding styles.

## Notes

- This project intentionally avoids a heavy framework. You can migrate to React/Vue/Svelte later if needed; Vite will still work as the dev/build tool.

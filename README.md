# Saba Fatima — Interactive 3D Portfolio

Hand-drawn sketchbook-style 3D portfolio for **Saba Fatima** (AI · CV · Flutter).

Inspired by the **ITom Interactive 3D Sketchbook** technique (itomdev.com) — scroll-driven corridor, pencil textures, paint-reveal hover — with **original assets and content** for Saba Fatima. No ITOM proprietary art was copied.

## Run

```bash
cd saba-3d-portfolio
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Stack

- Vite + React + TypeScript
- Three.js via `@react-three/fiber` + `@react-three/drei`
- Scroll-driven camera (lerp on window scroll)
- Procedural canvas sketch textures
- Custom GLSL `PaintRevealMaterial` (B&W → color on hover)

## Content

Portfolio data is loaded from `src/data/portfolio.json` (profile, contact, about, education, experience, skills, projects). Gallery frames use real GitHub projects with links.

## License

Personal portfolio site for Saba Fatima. Reference technique credited to ITom; artwork and code here are original.

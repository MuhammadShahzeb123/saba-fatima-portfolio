# Saba Fatima — Interactive 3D Portfolio

Hand-drawn sketchbook-style 3D portfolio for **Saba Fatima** (AI · CV · Flutter).

Inspired by the **ITom Interactive 3D Sketchbook** technique (itomdev.com) — scroll-driven corridor, pencil textures, paint-reveal hover — with **original assets and content** for Saba Fatima. No ITOM proprietary art was copied.

## UX

- **Scroll** (mouse wheel or touch swipe) walks the camera from the brick exterior into the corridor and rooms.
- **Entrance wall**: a grid of sketch door panes — each opens a different Sabafatima9 GitHub repo in a new tab. Use **Enter corridor · Scroll** (or keep scrolling) to go inside.
- **Gallery frames**: hover/tap for paint-reveal color; click opens the project.
- **Menu** jumps between Entrance / Hub / Gallery / About / Experience / Skills / Contact.
- **Mobile**: visualViewport-sized scroll track, touch→scroll bridge, `touch-action: pan-y`, DPR capped at 1.5, denser UI reflow (~44px tap targets).

## Run

```bash
cd saba-3d-portfolio
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Production build (GitHub Pages base `/saba-fatima-portfolio/`):

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

Portfolio data is loaded from `src/data/portfolio.json` (profile, contact, about, education, experience, skills, projects). Entrance doors and gallery frames use real GitHub projects with links.

## License

Personal portfolio site for Saba Fatima. Reference technique credited to ITom; artwork and code here are original.

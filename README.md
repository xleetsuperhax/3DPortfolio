# 3DCV

An interactive 3D portfolio built with BabylonJS and React. Projects are displayed as clickable cards arranged in a 3D scene that you can orbit and explore.

## Prerequisites

- Node.js 18+
- npm

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

## Controls

| Input | Action |
|---|---|
| Drag (mouse/touch) | Orbit the scene |
| Scroll wheel | Zoom in / out |
| Pinch (touch) | Zoom in / out |
| Click / Tap a card | View project details |

## Customization

Edit `src/config/projects.ts` to update portfolio content and layout:

- `gallery.layout` — `'arc'` | `'grid'` | `'scatter'`
- `gallery.arcRadius` — radius of the arc layout
- `gallery.cardSpacing` — spacing between cards
- `gallery.backgroundColor` — scene background hex color
- `projects[]` — array of project entries (title, description, tech, links, accent color)

## Tech Stack

- [BabylonJS](https://www.babylonjs.com/) — 3D engine
- [React](https://react.dev/) + TypeScript — UI layer
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [Vite](https://vitejs.dev/) — build tool

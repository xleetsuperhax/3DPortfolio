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

Edit `src/config/projects.ts` to update portfolio content and layout.

### Gallery settings

| Field | Type | Description |
|---|---|---|
| `layout` | `'arc' \| 'grid' \| 'scatter'` | Card arrangement in the scene |
| `arcRadius` | `number` | Radius of the arc layout (world units) |
| `cardSpacing` | `number` | Distance between cards (world units) |
| `backgroundColor` | `string` | Scene background hex color |

### Adding a card

Each entry in `projects[]` becomes a card in the scene:

```ts
{
  id: 'my-project',           // unique identifier (required)
  title: 'My Project',        // card title (required)
  description: 'What it does and why it matters.',  // shown in the panel
  tech: ['React', 'Node'],    // tech tags shown as pills
  year: 2025,                 // displayed above the title
  accentColor: '#7c3aed',     // card accent and tag color (hex)
  featured: true,             // enlarges the card slightly (optional)
  links: [                    // buttons shown in the side panel (optional)
    { label: 'Live Demo',     url: 'https://example.com' },
    { label: 'GitHub',        url: 'https://github.com/you/repo' },
    { label: 'Docs',          url: 'https://docs.example.com' },
  ],
}
```

**Link rendering:** The first link gets a filled button (using `accentColor`), all subsequent links are outlined. You can add as many links as needed — documentation, npm packages, blog posts, etc.

Cards are rendered in the order they appear in the array. Remove, reorder, or duplicate entries freely.

## Tech Stack

- [BabylonJS](https://www.babylonjs.com/) — 3D engine
- [React](https://react.dev/) + TypeScript — UI layer
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [Vite](https://vitejs.dev/) — build tool

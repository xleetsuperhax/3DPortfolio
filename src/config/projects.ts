import { AppConfig } from '../types'

// ─────────────────────────────────────────────
//  Edit this file to configure your portfolio.
//  Add/remove/reorder entries in `projects`.
//  Change `gallery` settings to tweak the scene.
// ─────────────────────────────────────────────

const config: AppConfig = {
  gallery: {
    // How cards are arranged: "arc" | "grid" | "scatter"
    layout: 'arc',
    // Distance between cards (world units)
    cardSpacing: 2,
    // Radius of the arc (world units)
    arcRadius: 4,
    // Scene background color (hex)
    backgroundColor: '#0a0a0f',
  },

  projects: [
    {
      id: 'project-1',
      title: '3D Portfolio (This one!)',
      description:
        'An interactive 3D space for exploring personal projects, built with BabylonJS and React.',
      tech: ['BabylonJS', 'React', 'TypeScript'],
      links: [
        { label: 'View on GitHub', url: 'https://github.com/xleetsuperhax/3DPortfolio' },
      ],
      year: 2026,
      accentColor: '#7c3aed'
    },
    {
      id: 'project-2',
      title: 'RoboAssay',
      description:
        'Robot Framework Library for evaluating the quality of LLM responses',
      tech: ['Python', 'Robot Framework'],
      links: [
        { label: 'Documentation', url: 'https://xleetsuperhax.github.io/RoboAssay' },
        { label: 'View on GitHub', url: 'https://github.com/xleetsuperhax/RoboAssay' },
      ],
      year: 2026,
      accentColor: '#0ea5e9',
    },
    {
      id: 'project-3',
      title: 'RoboWCAG',
      description:
        'Robot Framework Library for testing web accessibility with WCAG 2.1 Standard',
      tech: ['Python', 'Robot Framework'],
      links: [
        { label: 'View on GitHub', url: 'https://github.com/xleetsuperhax/RoboWCAG' },
      ],
      year: 2025,
      accentColor: '#10b981',
    },
    {
      id: 'project-4',
      title: 'Projects at Nordea',
      description:
        "While I cannot talk about the specifics of many of my projects, while at Nordea I created various internal tools to assist with testing operations. I was able to explore applications that are run from the CLI, and it really cemented my love for CLI as a way to interact with software.",
      tech: ['Python', 'Robot Framework', 'Textual', 'Scripting', 'CLI',],
      links: [
        { label: "Nordea's website", url: 'https://www.nordea.com/en' },
      ],
      year: 2025,
      accentColor: '#3b82f6',
    }
  ],
}

export default config

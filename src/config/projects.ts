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
    cardSpacing: 3.5,
    // Radius of the arc (world units)
    arcRadius: 6,
    // Scene background color (hex)
    backgroundColor: '#0a0a0f',
  },

  projects: [
    {
      id: 'project-1',
      title: '3D Portfolio (the one you are in right now!',
      description:
        'An interactive 3D space for exploring personal projects, built with BabylonJS and React.',
      tech: ['BabylonJS', 'React', 'TypeScript'],
      links: [
        { label: 'View on GitHub', url: 'https://github.com/xleetsuperhax/3dcv' },
      ],
      year: 2026,
      accentColor: '#7c3aed',
      featured: true,
    },
    {
      id: 'project-2',
      title: 'RoboAssay',
      description:
        'Robot Framework Library for evaluating the quality of LLM responses',
      tech: ['Python', 'Robot Framework'],
      links: [
        { label: 'Live Demo', url: 'https://example.com' },
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
      tech: ['Python', 'Robot Framework', 'Redis'],
      links: [
        { label: 'View on GitHub', url: 'https://github.com/xleetsuperhax/RoboWCAG' },
      ],
      year: 2025,
      accentColor: '#10b981',
    },
    {
      id: 'project-4',
      title: 'Side Project',
      description:
        'A side project placeholder. Fill in your tech stack, description, and GitHub URL.',
      tech: ['Place', 'Holder'],
      links: [
        { label: 'View on GitHub', url: 'https://github.com/yourusername/side' },
      ],
      year: 2023,
      accentColor: '#f59e0b',
    },
    {
      id: 'project-5',
      title: 'Open Source Tool',
      description:
        'An open source tool placeholder. Describe what problem it solves for other developers.',
      tech: ['Place', 'Holder'],
      links: [
        { label: 'View on GitHub', url: 'https://github.com/yourusername/tool' },
      ],
      year: 2023,
      accentColor: '#ef4444',
    },
  ],
}

export default config

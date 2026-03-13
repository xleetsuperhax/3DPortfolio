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
      title: '3D Portfolio',
      description:
        'An interactive 3D space for exploring personal projects, built with BabylonJS and React.',
      tech: ['BabylonJS', 'React', 'TypeScript'],
      githubUrl: 'https://github.com/yourusername/3dcv',
      year: 2025,
      accentColor: '#7c3aed',
      featured: true,
    },
    {
      id: 'project-2',
      title: 'Example Project',
      description:
        'Replace this with a real project. Add a description that explains what it does and why.',
      tech: ['Node.js', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com/yourusername/example',
      liveUrl: 'https://example.com',
      year: 2024,
      accentColor: '#0ea5e9',
    },
    {
      id: 'project-3',
      title: 'Another Project',
      description:
        'Another placeholder. Swap this out with one of your real projects and update the fields.',
      tech: ['Python', 'FastAPI', 'Redis'],
      githubUrl: 'https://github.com/yourusername/another',
      year: 2024,
      accentColor: '#10b981',
    },
    {
      id: 'project-4',
      title: 'Side Project',
      description:
        'A side project placeholder. Fill in your tech stack, description, and GitHub URL.',
      tech: ['Rust', 'WebAssembly'],
      githubUrl: 'https://github.com/yourusername/side',
      year: 2023,
      accentColor: '#f59e0b',
    },
    {
      id: 'project-5',
      title: 'Open Source Tool',
      description:
        'An open source tool placeholder. Describe what problem it solves for other developers.',
      tech: ['Go', 'gRPC', 'Kubernetes'],
      githubUrl: 'https://github.com/yourusername/tool',
      year: 2023,
      accentColor: '#ef4444',
    },
  ],
}

export default config

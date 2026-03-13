export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectConfig {
  id: string;
  title: string;
  description: string;
  tech: string[];
  links?: ProjectLink[];
  year: number;
  accentColor?: string;
  featured?: boolean;
}

export interface GalleryConfig {
  layout: 'arc' | 'grid' | 'scatter';
  cardSpacing: number;
  arcRadius: number;
  backgroundColor: string;
}

export interface AppConfig {
  gallery: GalleryConfig;
  projects: ProjectConfig[];
}

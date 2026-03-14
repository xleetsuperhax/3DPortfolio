// ─────────────────────────────────────────────────────────────────────────────
//  ABOUT ME CONFIG  —  src/config/about.ts
//
//  This file controls everything shown in the "About Me" dialog that opens
//  when you click the round medallion on the floor.
//
//  HOW TO EDIT:
//  ─ All fields are plain strings / arrays of strings — no code logic here.
//  ─ Dates are free-form strings (e.g. "05/2024 – 09/2024").
//  ─ `highlights` are bullet-point lines inside each experience / education entry.
//  ─ `skills.technical`, `skills.tools`, `skills.competencies` render as pill tags.
//  ─ `accentColor` controls the glow color of the floor disc and the dialog
//    accent highlights. Accepts any CSS hex color.
//  ─ After editing, save the file — Vite hot-reloads and the changes appear
//    instantly without restarting the dev server.
// ─────────────────────────────────────────────────────────────────────────────

export interface AboutContact {
  email: string
  linkedin: string
  location: string
}

export interface AboutExperience {
  company: string
  role: string
  period: string
  location: string
  highlights: string[]
}

export interface AboutEducation {
  institution: string
  degree: string
  period: string
  location: string
  highlights: string[]
  gpa?: string
}

export interface AboutSkills {
  technical: string[]
  tools: string[]
  competencies: string[]
}

export interface AboutLanguage {
  name: string
  level: string
}

export interface AboutConfig {
  name: string
  title: string
  summary: string
  contact: AboutContact
  experience: AboutExperience[]
  education: AboutEducation[]
  skills: AboutSkills
  languages: AboutLanguage[]
  /** Hex color for disc glow and dialog accent highlights */
  accentColor: string
}

// ─────────────────────────────────────────────────────────────────────────────
//  EDIT BELOW THIS LINE
// ─────────────────────────────────────────────────────────────────────────────

const aboutConfig: AboutConfig = {
  name: 'Roni Sheitanov',
  title: 'Test Automation Engineer',

  summary:
    'QA-enthusiast who thinks about quality holistically — not just as a step in the SDLC. ' +
    'I have experience in QA within Fintech and my goal is to become an expert people can rely on. ' +
    'Currently focused on integrating AI into QA in ways that genuinely serve the process. ' +
    'Also passionate about UX and accessibility — I wrote my thesis on accessibility test automation ' +
    'and built an open-source library for it. I embrace unfamiliar technologies and people describe ' +
    'me as sociable, easy-to-approach, and curious.',

  contact: {
    email: 'ronishei.georgiev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ronisheitanov-a83690192',
    location: 'Oulu, Finland',
  },

  experience: [
    {
      company: 'Nordea',
      role: 'Associate Digital QA Specialist (Fixed Term)',
      period: '10/2025 – 12/2025',
      location: 'Oulu, Finland',
      highlights: [
        'Developed a Test Automation Project in the Channel Quality Assurance team',
        'Focused on API testing with additional involvement in Web and Mobile testing',
        'Created scripts including Jenkins pipelines and tooling to support the testing process',
      ],
    },
    {
      company: 'Nordea',
      role: 'Associate Digital QA Specialist (Summer Trainee)',
      period: '05/2025 – 10/2025',
      location: 'Oulu, Finland',
      highlights: [
        'Developed a Test Automation Project in the Channel Quality Assurance team',
        'Focused on API testing with additional involvement in Web and Mobile testing',
        'Created scripts including Jenkins pipelines and solutions to assist with testing',
      ],
    },
    {
      company: 'Nordea',
      role: 'IT Test Analyst',
      period: '05/2024 – 09/2024',
      location: 'Oulu, Finland',
      highlights: [
        'Developed dynamic Robot Framework solutions for development teams',
        'Implemented Mobile Test Automation Regression Testing for iOS and Android',
        'Researched upcoming Test Automation technologies',
        'Trained and guided employees on Accessibility testing',
        'Wrote comprehensive Test Automation documentation for the organization',
      ],
    },
    {
      company: 'XPFirst OY',
      role: 'Creative Technology Consultant',
      period: '07/2023 – 08/2024',
      location: 'Oulu, Finland',
      highlights: [
        'Orchestrated, coordinated, and produced multiple audiovisual projects',
        'Provided tech support for gameplay-testing and created video setup guides',
        'Conducted macro-level UX analysis for multiple clients',
        'Led and coordinated gameplay testing teams',
      ],
    },
  ],

  education: [
    {
      institution: 'Tampere University',
      degree: 'Master of Science',
      period: '11/2023 – 01/2026',
      location: 'Tampere, Finland',
      highlights: ["Master's Thesis on Accessibility Test Automation"],
      gpa: '4.08 / 5.0',
    },
    {
      institution: 'Tampere University',
      degree: 'Bachelor of Science',
      period: '08/2020 – 11/2023',
      location: 'Tampere, Finland',
      highlights: ['Focus on Human Technology Interaction', 'Minor in Psychology'],
      gpa: '3.57 / 5.0',
    },
  ],

  skills: {
    technical: ['Robot Framework', 'Python', 'Appium', 'Jenkins', 'HTML', 'CSS'],
    tools: [
      'Jira', 'Confluence', 'Tricentis qTest', 'BrowserStack',
      'Git', 'GitHub', 'Bitbucket', 'GitHub Copilot',
      'Android SDK', 'Postman', 'Bruno',
    ],
    competencies: [
      'Test Automation', 'Manual Testing', 'API Testing', 'Web Testing',
      'Mobile Testing', 'UI Testing', 'System Testing', 'Regression Testing',
      'Test Planning', 'Test Design', 'BDD', 'CI/CD',
      'Agile', 'SAFE', 'Prompt Engineering', 'Software Documentation',
    ],
  },

  languages: [
    { name: 'Finnish', level: 'Native' },
    { name: 'English', level: 'Proficient' },
  ],

  // Disc glow color and dialog accent. Change to any hex value.
  accentColor: '#c084fc',
}

export default aboutConfig

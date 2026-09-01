export const profile = {
  name: "User",
  shortName: "Laxman",
  title: "Software Engineer · Full Stack Architect · AI Builder",
  tagline:
    "I build scalable web platforms, modernize legacy systems, and turn AI ideas into production-ready engineering workflows.",
  location: "India",
  website: "https://user.in/",
  github: "https://github.com/user",
  linkedin: "https://www.linkedin.com/in/User/",
  email: "User1@gmail.com",
  defaultLanguage: "en",
  languages: ["en", "hi", "fr"],
  years: "15+",
  currentRole: "Staff Engineer",
  summary:
    "Full Stack Lead / Staff Engineer with 15+ years of experience across Drupal, React, Angular, Node.js, PHP, cloud infrastructure, APIs, migrations, and AI-assisted development. Experienced in enterprise modernization, headless Drupal, decoupled architectures, and developer tooling.",
  stats: [
    { value: "15+", label: "Years engineering" },
    { value: "6–10+", label: "Drupal versions" },
    { value: "Full Stack", label: "Frontend + backend" },
    { value: "AI", label: "Agentic workflows" }
  ],
  skills: {
    "CMS & Architecture": ["Drupal 6–10+", "Headless Drupal", "Decoupled CMS", "Content Modeling", "WordPress", "Magento"],
    Frontend: ["React", "Angular", "Vue", "TypeScript", "JavaScript", "HTML5", "CSS3", "SASS", "Bootstrap", "D3.js", "SVG"],
    Backend: ["Node.js", "PHP", "REST APIs", "Microservices", "FastAPI", "CodeIgniter"],
    "Cloud & DevOps": ["Azure", "Docker", "Kubernetes", "DDEV", "Traefik", "Jenkins", "GitHub Actions", "Ansible"],
    Data: ["MySQL", "PostgreSQL", "SQLAlchemy"],
    AI: ["LLM APIs", "RAG", "AI Agents", "Ollama", "Browser Automation", "AI-assisted Development"]
  }
};

export const experience = [
  {
    period: "Current",
    role: "Staff Engineer",
    company: "Company Name",
    location: "Bangalore, India",
    description:
      "Enterprise web engineering across modern Drupal, headless/decoupled architecture, frontend applications, APIs, migrations, cloud tooling, and AI-assisted development."
  },
  {
    period: "Previous",
    role: "Pantheon — Development Team Lead",
    company: "Company Name",
    location: "Remote",
    description:
      "Led full-stack delivery across CMS platforms, custom web applications, integrations, APIs, frontend frameworks, databases, and DevOps workflows."
  }
];

export const projects = [
  {
    title: "Headless Drupal Modernization",
    category: "Enterprise Architecture",
    description:
      "Modernized legacy Drupal platforms toward decoupled architecture, combining Drupal content services with modern JavaScript frontends and API-driven delivery.",
    tags: ["Drupal", "React", "REST", "Architecture"],
    featured: true
  },
  {
    title: "Drupal 9 → 10 Migration",
    category: "Migration Engineering",
    description:
      "Custom migration tooling for content, bundles, translations, users, and legacy structures, with debugging across database connections and migration plugins.",
    tags: ["Drupal", "Migrate API", "PHP", "MySQL"],
    featured: true
  },
  {
    title: "Institutional Data Explorer",
    category: "AI/Data Platform",
    description:
      "FastAPI + React application architecture for exploring institutional data, with API services, SQLAlchemy-backed data access, and a modern frontend.",
    tags: ["FastAPI", "React", "Python", "PostgreSQL"],
    featured: true
  },
  {
    title: "Browser-Use AI Experiments",
    category: "AI Engineering",
    description:
      "Exploration of browser automation and agentic workflows for research, validation, and repetitive engineering tasks.",
    tags: ["AI Agents", "Browser Automation", "Python"],
    featured: true
  },
  {
    title: "Enterprise React Applications",
    category: "Frontend Engineering",
    description:
      "Reusable React interfaces, dashboards, data tables, charts, dynamic forms, API integrations, and component-driven UI systems.",
    tags: ["React", "TypeScript", "Charts", "REST"],
    featured: false
  },
  {
    title: "Local AI Development",
    category: "Developer Productivity",
    description:
      "Hands-on local LLM workflows using Ollama and developer tooling to accelerate coding, research, troubleshooting, and technical experimentation.",
    tags: ["Ollama", "LLMs", "AI", "Developer Tools"],
    featured: false
  },
  {
    title: "Portfolio AI",
    category: "AI Engineering",
    description:
      "Interactive AI portfolio assistant that answers recruiter-style questions using structured portfolio context, resume knowledge, multilingual responses, and Gemini API usage tracking.",
    tags: ["Next.js", "Gemini", "TypeScript", "AI Assistant"],
    featured: true
  }
];

 "use client";

import { useEffect, useMemo, useState } from "react";
import { experience, profile, projects } from "@/data/profile";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

type UsageSummary = {
  requests: number;
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
};

type WeatherResponse = {
  current?: {
    weather_code?: number;
  };
};

function weatherSymbol(code: number) {
  if (code === 0) return { icon: "☀", label: "Sunny", tone: "sunny" };
  if ([1, 2].includes(code)) return { icon: "⛅", label: "Partly cloudy", tone: "partly-cloudy" };
  if (code === 3) return { icon: "☁", label: "Cloudy", tone: "cloudy" };
  if ([45, 48].includes(code)) return { icon: "〰", label: "Foggy", tone: "foggy" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: "☂", label: "Rainy", tone: "rainy" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: "❄", label: "Snowy", tone: "snowy" };
  if ([95, 96, 99].includes(code)) return { icon: "⚡", label: "Stormy", tone: "stormy" };
  return { icon: "☁", label: "Cloudy", tone: "cloudy" };
}

const icons = {
  arrow: "↗",
  github: "🐙️",
  mail: "✉",
  spark: "✦",
  linkedin: "🔵️",
  site: "🌀",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [language, setLanguage] = useState<"en" | "hi" | "fr">("en");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState({ icon: "☁", label: "Cloudy", tone: "cloudy" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime([now.getHours(), now.getMinutes(), now.getSeconds()].map((part) => String(part).padStart(2, "0")).join(":"));
    };
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=weather_code`);
        if (!response.ok) return;
        const data: WeatherResponse = await response.json();
        if (typeof data.current?.weather_code === "number") setWeather(weatherSymbol(data.current.weather_code));
      } catch {
        // Keep the neutral weather symbol if the lookup is unavailable.
      }
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) setDark(saved === "dark");
    const savedLanguage = localStorage.getItem("portfolio-language") as "en" | "hi" | "fr" | null;
    if (savedLanguage && ["en", "hi", "fr"].includes(savedLanguage)) setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark]);

  const translations = {
    en: {
      navWork: "Work", navSkills: "Skills", navExperience: "Experience", navAi: "AI Portfolio", navGithub: "GitHub", navContact: "Contact",
      eyebrow: "OPEN TO GREAT ENGINEERING PROBLEMS",
      hero: "Staff Engineer building modern web platforms and AI-powered experiences.",
      heroText: profile.tagline, explore: "Explore my work", conversation: "Start a conversation",
      aiEyebrow: "AI PORTFOLIO ASSISTANT", aiTitle: "Ask about my work experience.",
      aiDesc: "Ask a recruiter-style question. The assistant will answer using my portfolio and project context.", usageTitle: "Live instance totals", usageRefresh: "Refresh", usageRequests: "Requests", usagePrompt: "Prompt tokens", usageOutput: "Output tokens", usageTotal: "Total tokens", weatherSunny: "Sunny", weatherPartlyCloudy: "Partly cloudy", weatherCloudy: "Cloudy", weatherFoggy: "Foggy", weatherRainy: "Rainy", weatherSnowy: "Snowy", weatherStormy: "Stormy",
      askPlaceholder: "Ask something about my experience...", ask: "Ask AI", thinking: "Thinking…", aiUnavailable: "The AI assistant is temporarily unavailable.",
      workEyebrow: "SELECTED WORK", workTitle: "Engineering that solves real problems.",
      skillsEyebrow: "TECHNICAL STACK", skillsTitle: "Broad enough for the whole system.",
      expEyebrow: "EXPERIENCE", expTitle: "A career across platforms and generations of the web.",
      githubEyebrow: "OPEN SOURCE", githubTitle: "What I’m building on GitHub.",
      contactEyebrow: "LET’S CONNECT", contactTitle: "Have a hard problem? Let’s build the solution.",
      email: "Email me", github: "GitHub",linkedin: "LinkedIn",
      terminalLine: "ship something useful",
      aiName: "Portfolio AI",
      aiPrompts: ["Who AM I ?", "Why am I a good Staff Engineer candidate ?", "What is my Drupal experience ?", "Tell me about my AI work."],
      workSubtitle: "Architecture, migrations, frontend platforms, data applications, and AI experiments.",
      contactText: "For engineering leadership, architecture, modernization, AI, or full-stack opportunities, get in touch.",
      statsLabels: ["Years engineering", "Drupal versions", "Frontend + backend", "Agentic workflows"],
      periodCurrent: "Current", periodPrevious: "Previous",
      viewProfile: "View profile", repoFallback: "Open-source project and engineering experiments.",
      reposLoading: "Loading public repositories from GitHub…",
      builtWith: "Built with Next.js · TypeScript · AI",
      projects: [
        { title: "Headless Drupal Modernization", category: "Enterprise Architecture", description: "Modernized legacy Drupal platforms toward decoupled architecture, combining Drupal content services with modern JavaScript frontends and API-driven delivery." },
        { title: "Drupal 9 → 10 Migration", category: "Migration Engineering", description: "Custom migration tooling for content, bundles, translations, users, and legacy structures, with debugging across database connections and migration plugins." },
        { title: "Institutional Data Explorer", category: "AI/Data Platform", description: "FastAPI + React application architecture for exploring institutional data, with API services, SQLAlchemy-backed data access, and a modern frontend." },
        { title: "Browser-Use AI Experiments", category: "AI Engineering", description: "Exploration of browser automation and agentic workflows for research, validation, and repetitive engineering tasks." },
        { title: "Enterprise React Applications", category: "Frontend Engineering", description: "Reusable React interfaces, dashboards, data tables, charts, dynamic forms, API integrations, and component-driven UI systems." },
        { title: "Local AI Development", category: "Developer Productivity", description: "Hands-on local LLM workflows using Ollama and developer tooling to accelerate coding, research, troubleshooting, and technical experimentation." },
        { title: "Portfolio AI", category: "AI Engineering", description: "Interactive AI portfolio assistant that answers recruiter-style questions using portfolio context, resume knowledge, multilingual responses, and Gemini API usage tracking." }
      ],
      experience: [
        { role: "Staff Engineer", description: "Enterprise web engineering across modern Drupal, headless/decoupled architecture, frontend applications, APIs, migrations, cloud tooling, and AI-assisted development." },
        { role: "Full Stack Lead / Senior Engineer", description: "Led full-stack delivery across CMS platforms, custom web applications, integrations, APIs, frontend frameworks, databases, and DevOps workflows." }
      ]
    },
    hi: {
      navWork: "काम", navSkills: "कौशल", navExperience: "अनुभव", navAi: "AI पोर्टफोलियो", navGithub: "GitHub", navContact: "संपर्क",
      eyebrow: "बेहतरीन इंजीनियरिंग समस्याओं के लिए उपलब्ध",
      hero: "Staff Engineer जो आधुनिक वेब प्लेटफ़ॉर्म और AI-संचालित अनुभव बनाता है।",
      heroText: "मैं स्केलेबल वेब प्लेटफ़ॉर्म बनाता हूँ, पुराने सिस्टम को आधुनिक बनाता हूँ और AI विचारों को प्रोडक्शन-रेडी समाधान में बदलता हूँ।",
      explore: "मेरा काम देखें", conversation: "बात शुरू करें",
      aiEyebrow: "AI पोर्टफोलियो सहायक", aiTitle: "मेरे इंजीनियरिंग अनुभव के बारे में पूछें।",
      aiDesc: "Recruiter जैसा प्रश्न पूछें। सहायक पोर्टफोलियो प्रोफ़ाइल और प्रोजेक्ट संदर्भ से उत्तर देगा।", usageTitle: "लाइव इंस्टेंस कुल", usageRefresh: "रीफ्रेश", usageRequests: "अनुरोध", usagePrompt: "प्रॉम्प्ट टोकन", usageOutput: "आउटपुट टोकन", usageTotal: "कुल टोकन", weatherSunny: "धूप", weatherPartlyCloudy: "आंशिक बादल", weatherCloudy: "बादल", weatherFoggy: "कोहरा", weatherRainy: "बारिश", weatherSnowy: "बर्फ़बारी", weatherStormy: "तूफ़ान",
      askPlaceholder: "मेरे अनुभव के बारे में पूछें...", ask: "AI से पूछें", thinking: "सोच रहा है…", aiUnavailable: "AI सहायक अस्थायी रूप से उपलब्ध नहीं है। कृपया नीचे दिए गए संपर्क लिंक का उपयोग करें।",
      workEyebrow: "चयनित कार्य", workTitle: "ऐसी इंजीनियरिंग जो वास्तविक समस्याएँ हल करती है।",
      skillsEyebrow: "तकनीकी स्टैक", skillsTitle: "पूरे सिस्टम के लिए व्यापक तकनीकी कौशल।",
      expEyebrow: "अनुभव", expTitle: "वेब की विभिन्न पीढ़ियों और प्लेटफ़ॉर्म पर अनुभव।",
      githubEyebrow: "ओपन सोर्स", githubTitle: "GitHub पर मैं क्या बना रहा हूँ।",
      contactEyebrow: "संपर्क करें", contactTitle: "कोई कठिन समस्या है? आइए समाधान बनाते हैं।",
      email: "मुझे ईमेल करें", github: "GitHub", linkedin: "LinkedIn",
      terminalLine: "कुछ उपयोगी बनाएँ",
      aiName: "पोर्टफोलियो AI",
      aiPrompts: ["मैं कौन हूँ ?","मैं एक अच्छा Staff Engineer उम्मीदवार क्यों हूँ ?", "Drupal में मेरा अनुभव क्या है ?", "मेरे AI कार्य के बारे में बताएं।"],
      workSubtitle: "आर्किटेक्चर, माइग्रेशन, फ्रंटएंड प्लेटफ़ॉर्म, डेटा एप्लिकेशन और AI प्रयोग।",
      contactText: "इंजीनियरिंग लीडरशिप, आर्किटेक्चर, आधुनिकीकरण, AI, या फुल-स्टैक अवसरों के लिए संपर्क करें।",
      statsLabels: ["वर्षों का अनुभव", "Drupal वर्शन", "फ्रंटएंड + बैकएंड", "एजेंटिक वर्कफ़्लो"],
      periodCurrent: "वर्तमान", periodPrevious: "पूर्व",
      viewProfile: "प्रोफ़ाइल देखें", repoFallback: "ओपन-सोर्स प्रोजेक्ट और इंजीनियरिंग प्रयोग।",
      reposLoading: "GitHub से सार्वजनिक रिपॉज़िटरी लोड हो रही हैं…",
      builtWith: "Next.js · TypeScript · AI के साथ निर्मित",
      projects: [
        { title: "हेडलेस Drupal आधुनिकीकरण", category: "एंटरप्राइज़ आर्किटेक्चर", description: "पुराने Drupal प्लेटफ़ॉर्म को डीकपल्ड आर्किटेक्चर की ओर आधुनिक बनाया, Drupal कंटेंट सेवाओं को आधुनिक JavaScript फ्रंटएंड और API-आधारित डिलीवरी के साथ जोड़ा।" },
        { title: "Drupal 9 → 10 माइग्रेशन", category: "माइग्रेशन इंजीनियरिंग", description: "कंटेंट, बंडल, अनुवाद, उपयोगकर्ताओं और लीगेसी स्ट्रक्चर के लिए कस्टम माइग्रेशन टूलिंग, डेटाबेस कनेक्शन और माइग्रेशन प्लगइन में डिबगिंग के साथ।" },
        { title: "इंस्टीट्यूशनल डेटा एक्सप्लोरर", category: "AI/डेटा प्लेटफ़ॉर्म", description: "इंस्टीट्यूशनल डेटा एक्सप्लोर करने के लिए FastAPI + React एप्लिकेशन आर्किटेक्चर, API सेवाओं, SQLAlchemy-आधारित डेटा एक्सेस और आधुनिक फ्रंटएंड के साथ।" },
        { title: "ब्राउज़र-यूज़ AI प्रयोग", category: "AI इंजीनियरिंग", description: "रिसर्च, वैलिडेशन और दोहराए जाने वाले इंजीनियरिंग कार्यों के लिए ब्राउज़र ऑटोमेशन और एजेंटिक वर्कफ़्लो की खोज।" },
        { title: "एंटरप्राइज़ React एप्लिकेशन", category: "फ्रंटएंड इंजीनियरिंग", description: "पुन: प्रयोज्य React इंटरफ़ेस, डैशबोर्ड, डेटा टेबल, चार्ट, डायनामिक फ़ॉर्म, API इंटीग्रेशन और कंपोनेंट-आधारित UI सिस्टम।" },
        { title: "लोकल AI डेवलपमेंट", category: "डेवलपर प्रोडक्टिविटी", description: "कोडिंग, रिसर्च, ट्रबलशूटिंग और तकनीकी प्रयोग को तेज़ करने के लिए Ollama और डेवलपर टूलिंग का उपयोग करते हुए हैंड्स-ऑन लोकल LLM वर्कफ़्लो।" },
        { title: "पोर्टफोलियो AI", category: "AI इंजीनियरिंग", description: "पोर्टफोलियो संदर्भ, रिज्यूमे ज्ञान, बहुभाषी उत्तरों और Gemini API उपयोग ट्रैकिंग के साथ recruiter-style प्रश्नों का उत्तर देने वाला इंटरैक्टिव AI सहायक।" }
      ],
      experience: [
        { role: "Staff Engineer", description: "आधुनिक Drupal, हेडलेस/डीकपल्ड आर्किटेक्चर, फ्रंटएंड एप्लिकेशन, API, माइग्रेशन, क्लाउड टूलिंग और AI-सहायता प्राप्त डेवलपमेंट में एंटरप्राइज़ वेब इंजीनियरिंग।" },
        { role: "Full Stack Lead / वरिष्ठ इंजीनियर", description: "CMS प्लेटफ़ॉर्म, कस्टम वेब एप्लिकेशन, इंटीग्रेशन, API, फ्रंटएंड फ्रेमवर्क, डेटाबेस और DevOps वर्कफ़्लो में फुल-स्टैक डिलीवरी का नेतृत्व किया।" }
      ]
    },
    fr: {
      navWork: "Projets", navSkills: "Compétences", navExperience: "Expérience", navAi: "Portfolio IA", navGithub: "GitHub", navContact: "Contact",
      eyebrow: "OUVERT AUX DÉFIS D’INGÉNIERIE",
      hero: "Staff Engineer qui construit des plateformes web modernes et des expériences propulsées par l’IA.",
      heroText: "Je construis des plateformes web évolutives, modernise les systèmes existants et transforme les idées d’IA en solutions prêtes pour la production.",
      explore: "Voir mes projets", conversation: "Démarrer une conversation",
      aiEyebrow: "ASSISTANT IA DU PORTFOLIO", aiTitle: "Posez une question sur mon expérience d’ingénieur.",
      aiDesc: "Posez une question de recruteur. L’assistant répond à partir du profil et du contexte des projets.", usageTitle: "Totaux de l’instance en direct", usageRefresh: "Actualiser", usageRequests: "Requêtes", usagePrompt: "Tokens du prompt", usageOutput: "Tokens de sortie", usageTotal: "Tokens totaux", weatherSunny: "Ensoleillé", weatherPartlyCloudy: "Partiellement nuageux", weatherCloudy: "Nuageux", weatherFoggy: "Brumeux", weatherRainy: "Pluvieux", weatherSnowy: "Neigeux", weatherStormy: "Orageux",
      askPlaceholder: "Posez une question sur mon expérience...", ask: "Demander à l’IA", thinking: "Réflexion…", aiUnavailable: "L’assistant IA est temporairement indisponible. Utilisez les liens de contact ci-dessous.",
      workEyebrow: "PROJETS SÉLECTIONNÉS", workTitle: "Une ingénierie conçue pour résoudre de vrais problèmes.",
      skillsEyebrow: "STACK TECHNIQUE", skillsTitle: "Une expertise suffisamment large pour tout le système.",
      expEyebrow: "EXPÉRIENCE", expTitle: "Une carrière à travers plusieurs plateformes et générations du web.",
      githubEyebrow: "OPEN SOURCE", githubTitle: "Ce que je construis sur GitHub.",
      contactEyebrow: "CONTACT", contactTitle: "Un problème complexe ? Construisons la solution.",
      email: "M’écrire", github: "GitHub",linkedin: "LinkedIn",
      terminalLine: "livrer quelque chose d’utile",
      aiName: "Portfolio IA",
      aiPrompts: ["Qui suis-je ?", "Pourquoi suis-je un bon candidat Staff Engineer ?", "Quelle est mon expérience avec Drupal ?", "Parlez-moi de mon travail en IA."],
      workSubtitle: "Architecture, migrations, plateformes frontend, applications de données et expérimentations IA.",
      contactText: "Pour des opportunités de leadership technique, d’architecture, de modernisation, d’IA ou de full-stack, contactez-moi.",
      statsLabels: ["Années d’ingénierie", "Versions de Drupal", "Frontend + backend", "Workflows agentiques"],
      periodCurrent: "Actuel", periodPrevious: "Précédent",
      viewProfile: "Voir le profil", repoFallback: "Projet open source et expérimentations d’ingénierie.",
      reposLoading: "Chargement des dépôts publics depuis GitHub…",
      builtWith: "Construit avec Next.js · TypeScript · IA",
      projects: [
        { title: "Modernisation Drupal headless", category: "Architecture d’entreprise", description: "Modernisation de plateformes Drupal existantes vers une architecture découplée, combinant les services de contenu Drupal avec des frontends JavaScript modernes et une livraison pilotée par API." },
        { title: "Migration Drupal 9 → 10", category: "Ingénierie de migration", description: "Outils de migration personnalisés pour le contenu, les bundles, les traductions, les utilisateurs et les structures existantes, avec du débogage sur les connexions de base de données et les plugins de migration." },
        { title: "Explorateur de données institutionnelles", category: "Plateforme IA/Données", description: "Architecture d’application FastAPI + React pour explorer des données institutionnelles, avec des services API, un accès aux données via SQLAlchemy et un frontend moderne." },
        { title: "Expérimentations IA par navigateur", category: "Ingénierie IA", description: "Exploration de l’automatisation de navigateur et des workflows agentiques pour la recherche, la validation et les tâches d’ingénierie répétitives." },
        { title: "Applications React d’entreprise", category: "Ingénierie frontend", description: "Interfaces React réutilisables, tableaux de bord, tables de données, graphiques, formulaires dynamiques, intégrations API et systèmes d’UI orientés composants." },
        { title: "Développement IA local", category: "Productivité développeur", description: "Workflows LLM locaux pratiques utilisant Ollama et des outils de développement pour accélérer le codage, la recherche, le dépannage et l’expérimentation technique." },
        { title: "Portfolio IA", category: "Ingénierie IA", description: "Assistant IA interactif qui répond aux questions de recruteur à partir du contexte du portfolio, du CV, de réponses multilingues et du suivi de l’utilisation de l’API Gemini." }
      ],
      experience: [
        { role: "Staff Engineer", description: "Ingénierie web d’entreprise couvrant Drupal moderne, architecture headless/découplée, applications frontend, API, migrations, outillage cloud et développement assisté par IA." },
        { role: "Full Stack Lead / Ingénieur senior", description: "Direction de la livraison full-stack sur des plateformes CMS, applications web personnalisées, intégrations, API, frameworks frontend, bases de données et workflows DevOps." }
      ]
    }
  }[language];

  function localizedWeatherLabel() {
    if (weather.tone === "sunny") return translations.weatherSunny;
    if (weather.tone === "partly-cloudy") return translations.weatherPartlyCloudy;
    if (weather.tone === "foggy") return translations.weatherFoggy;
    if (weather.tone === "rainy") return translations.weatherRainy;
    if (weather.tone === "snowy") return translations.weatherSnowy;
    if (weather.tone === "stormy") return translations.weatherStormy;
    return translations.weatherCloudy;
  }

  function changeLanguage(value: "en" | "hi" | "fr") {
    setLanguage(value);
    localStorage.setItem("portfolio-language", value);
  }

  async function loadUsage() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usage`, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setUsage({
        requests: data.requests ?? 0,
        promptTokens: data.promptTokens ?? 0,
        outputTokens: data.outputTokens ?? 0,
        totalTokens: data.totalTokens ?? 0,
      });
    } catch {
      setUsage(null);
    }
  }

  useEffect(() => {
    void loadUsage();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/github`)
      .then((r) => r.json())
      .then((data) => setRepos(data.repos ?? []))
      .catch(() => setRepos([]));
  }, []);

  const featured = useMemo(() => projects.map((p, idx) => ({ ...p, idx })).filter((p) => p.featured), []);

  async function askAI(prompt?: string) {
    const q = (prompt ?? question).trim();
    if (!q) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, language })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The AI assistant could not complete the request.");
      setAnswer(data.answer ?? translations.aiUnavailable);
      void loadUsage();
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : translations.aiUnavailable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Home">
          <span className="brand-mark">L</span>
          <span>User</span>
        </a>
        <nav>
          <a
            className={activeSection === "ai" ? "active" : ""}
            aria-current={activeSection === "ai" ? "page" : undefined}
            href="#ai"
            onClick={() => setActiveSection("ai")}
          >
            {translations.navAi}
          </a>
          <a
            className={activeSection === "work" ? "active" : ""}
            aria-current={activeSection === "work" ? "page" : undefined}
            href="#work"
            onClick={() => setActiveSection("work")}
          >
            {translations.navWork}
          </a>
          <a
            className={activeSection === "skills" ? "active" : ""}
            aria-current={activeSection === "skills" ? "page" : undefined}
            href="#skills"
            onClick={() => setActiveSection("skills")}
          >
            {translations.navSkills}
          </a>
          <a
            className={activeSection === "experience" ? "active" : ""}
            aria-current={activeSection === "experience" ? "page" : undefined}
            href="#experience"
            onClick={() => setActiveSection("experience")}
          >
            {translations.navExperience}
          </a>
          <a
            className={activeSection === "github" ? "active" : ""}
            aria-current={activeSection === "github" ? "page" : undefined}
            href="#github"
            onClick={() => setActiveSection("github")}
          >
            {translations.navGithub}
          </a>
          <a
            className={activeSection === "contact" ? "active" : ""}
            aria-current={activeSection === "contact" ? "page" : undefined}
            href="#contact"
            onClick={() => setActiveSection("contact")}
          >
            {translations.navContact}
          </a>
        </nav>
        <div className="language-select">
          <label className="sr-only" htmlFor="language-menu">
            Language
          </label>
          <select
            id="language-menu"
            value={language}
            onChange={(event) =>
              changeLanguage(event.target.value as "en" | "hi" | "fr")
            }
          >
            <option value="en">EN · English</option>
            <option value="hi">हिन्दी · Hindi</option>
            <option value="fr">FR · Français</option>
          </select>
        </div>
        <div className="nav-status">
          <div className="nav-clock">
            <span
              className="weather"
              title={localizedWeatherLabel()}
              aria-label={localizedWeatherLabel()}
            >
              <span
                className={`weather-icon weather-${weather.tone}`}
                aria-hidden="true"
              >
                {weather.icon}
              </span>
              <span className="weather-label">{localizedWeatherLabel()}</span>
            </span>
            <time
              className="clock"
              dateTime={time || undefined}
              aria-label="Current time"
            >
              {time || "--:--:--"}
            </time>
          </div>
          <button
            className="theme-button"
            onClick={() => setDark((v) => !v)}
            aria-label="Toggle theme"
          >
            {dark ? "☼" : "☾"}
          </button>
        </div>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse" /> {translations.eyebrow}
          </div>
          <h1>{translations.hero}</h1>
          <p className="hero-text">{translations.heroText}</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">
              {translations.explore} {icons.arrow}
            </a>
            <a className="button ghost" href={`mailto:${profile.email}`}>
              {translations.conversation}
            </a>
          </div>
          <div className="quick-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              {icons.linkedin} Linkedin
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              {icons.github} GitHub
            </a>
            <a href={profile.website} target="_blank" rel="noreferrer">
              {icons.site} lakshm.in {icons.arrow}
            </a>
          </div>
        </div>
        <div className="hero-card">
          <div className="grid-glow" />
          <div className="code-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
            </div>
            <pre>{`const engineer = {
  experience: "15+ years",
  focus: [
    "Drupal",
    "React",
    "Node.js",
    "AI"
  ],
  mindset: "Build • Learn • Automate"
};`}</pre>
            <div className="terminal-line">
              <span>➜</span> {translations.terminalLine}
              <span className="cursor">_</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats shell">
        {profile.stats.map((s, i) => (
          <div className="stat" key={s.label}>
            <strong>{s.value}</strong>
            <span>{translations.statsLabels[i]}</span>
          </div>
        ))}
      </section>

      <section className="section shell ai-section" id="ai">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{translations.aiEyebrow}</span>
            <h2>{translations.aiTitle}</h2>
          </div>
          <span className="ai-badge">{icons.spark} AI</span>
        </div>
        <div className="ai-panel">
          <div className="ai-intro">
            <div className="ai-orb">{icons.spark}</div>
            <div>
              <strong>{translations.aiName}</strong>
              <p>{translations.aiDesc}</p>
            </div>
          </div>
          <div className="prompt-row">
            {translations.aiPrompts.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setQuestion(p);
                  askAI(p);
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askAI();
            }}
            className="ai-form"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={translations.askPlaceholder}
              disabled={loading}
            />
            <button className="button primary" disabled={loading}>
              {loading ? translations.thinking : translations.ask}
            </button>
          </form>
          {usage && (
            <div className="ai-usage">
              <span className="ai-usage-title">{translations.usageTitle}</span>
              <div className="ai-usage-grid">
                <span>
                  <strong>{usage.requests.toLocaleString()}</strong>
                  {translations.usageRequests}
                </span>
                <span>
                  <strong>{usage.promptTokens.toLocaleString()}</strong>
                  {translations.usagePrompt}
                </span>
                <span>
                  <strong>{usage.outputTokens.toLocaleString()}</strong>
                  {translations.usageOutput}
                </span>
                <span>
                  <strong>{usage.totalTokens.toLocaleString()}</strong>
                  {translations.usageTotal}
                </span>
              </div>
              <button
                className="ai-usage-refresh"
                type="button"
                onClick={() => void loadUsage()}
              >
                {translations.usageRefresh}
              </button>
            </div>
          )}
          {answer && (
            <div className="ai-answer">
              <strong>AI</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section shell" id="work">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{translations.workEyebrow}</span>
            <h2>{translations.workTitle}</h2>
          </div>
          <p>{translations.workSubtitle}</p>
        </div>
        <div className="project-grid">
          {featured.map((project, i) => (
            <article className="project-card" key={project.title}>
              <div className="project-number">0{i + 1}</div>
              <span className="project-category">
                {translations.projects[project.idx].category}
              </span>
              <h3>{translations.projects[project.idx].title}</h3>
              <p>{translations.projects[project.idx].description}</p>
              <div className="tags">
                {project.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell" id="skills">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{translations.skillsEyebrow}</span>
            <h2>{translations.skillsTitle}</h2>
          </div>
        </div>
        <div className="skill-grid">
          {Object.entries(profile.skills).map(([group, skills]) => (
            <div className="skill-group" key={group}>
              <h3>{group}</h3>
              <div className="tags">
                {skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section shell" id="experience">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{translations.expEyebrow}</span>
            <h2>{translations.expTitle}</h2>
          </div>
        </div>
        <div className="timeline">
          {experience.map((item, i) => (
            <div className="timeline-item" key={item.role + item.company}>
              <div className="timeline-dot" />
              <span>
                {item.period === "Current"
                  ? translations.periodCurrent
                  : translations.periodPrevious}
              </span>
              <div>
                <h3>{translations.experience[i].role}</h3>
                <h4>{item.company}</h4>
                <p>{translations.experience[i].description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section shell" id="github">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{translations.githubEyebrow}</span>
            <h2>{translations.githubTitle}</h2>
          </div>
          <a
            className="text-link"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            {translations.viewProfile} {icons.arrow}
          </a>
        </div>
        <div className="repo-grid">
          {repos.length ? (
            repos.slice(0, 6).map((repo) => (
              <a
                className="repo-card"
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                key={repo.name}
              >
                <div>
                  <strong>{repo.name}</strong>
                  <span>↗</span>
                </div>
                <p>{repo.description || translations.repoFallback}</p>
                <small>
                  {repo.language || "Code"} · ★ {repo.stargazers_count}
                </small>
              </a>
            ))
          ) : (
            <div className="empty-repos">{translations.reposLoading}</div>
          )}
        </div>
      </section>

      <section className="section shell contact-section" id="contact">
        <div className="contact-card">
          <span className="eyebrow">{translations.contactEyebrow}</span>
          <h2>{translations.contactTitle}</h2>
          <p>{translations.contactText}</p>
          <div className="hero-actions">
            <a className="button primary" href={`mailto:${profile.email}`}>
              {translations.email} {icons.arrow}
            </a>
            <a
              className="button ghost"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              {translations.github} {icons.arrow}
            </a>
            <a
              className="button ghost"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              {translations.linkedin} {icons.arrow}
            </a>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        {/*<span>{translations.builtWith}</span>*/}
      </footer>
    </main>
  );
}

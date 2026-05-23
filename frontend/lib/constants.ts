export const RESUME_PDFS = {
  ats: "/Anchit_Boruah_PM_Resume_ATS_2026-05.pdf",
  onePage: "/Anchit_Boruah_PM_Resume_OnePage_2026-05.pdf",
} as const;

export const OUTREACH_FILES = {
  founders: "outreach/founder_outreach.md",
  recruiters: "outreach/recruiter_outreach.md",
  hms: "outreach/cold_emails.md",
  linkedin: "outreach/linkedin_messages.md",
} as const;

export type OutreachTab = keyof typeof OUTREACH_FILES;

export const COMPANY_TYPES = [
  { id: "early-stage", label: "Early-Stage", variant: "A", pitchKey: "early" },
  { id: "ai-startup", label: "AI Startup", variant: "A", pitchKey: "ai" },
  { id: "plg", label: "PLG", variant: "C", pitchKey: "plg" },
  { id: "series-bc", label: "Series B/C", variant: "B", pitchKey: "scale" },
  { id: "founder-led", label: "Founder-Led", variant: "A", pitchKey: "founder" },
] as const;

export type CompanyTypeId = (typeof COMPANY_TYPES)[number]["id"];

export const PROJECTS = [
  {
    id: "mf-rag",
    title: "RAG Chatbot, Mutual Fund Factual Response",
    description:
      "Facts-only mutual fund Q&A—weekday pipeline, ChromaDB + Groq, cited answers in ≤3s. Trusted by 200+ users.",
    metric: "200+",
    metricLabel: "Active users",
    tags: ["RAG", "FinTech", "GitHub Actions"],
    portfolioUrl: "https://anchit-boruah-online-portfolio.vercel.app/",
  },
  {
    id: "review-analyzer",
    title: "Groww Review Analyzer AI Agent",
    description:
      "Weekly agent—App/Play Store reviews → Google Doc + Gmail draft for leadership via MCP (Docs + Gmail).",
    metric: "Weekly",
    metricLabel: "Leadership VoC",
    tags: ["Agentic AI", "MCP", "Groq"],
    portfolioUrl: "https://anchit-boruah-online-portfolio.vercel.app/",
  },
  {
    id: "swish",
    title: "Swish Delivery Trust Research",
    description:
      "Four failure themes + personas; 6-part LinkedIn series—brief, roadmap, PRDs, wireframes.",
    metric: "6-part",
    metricLabel: "LinkedIn series",
    tags: ["B2C", "User Research", "PRD"],
    portfolioUrl: "https://anchit-boruah-online-portfolio.vercel.app/",
  },
  {
    id: "meta",
    title: "Meta Campaign Activation",
    description:
      "4-phase roadmap for zero-touch Meta activation—35% FTE savings, 100% adoption, ~₹1.5 Cr+ department savings.",
    metric: "35%",
    metricLabel: "FTE savings",
    tags: ["AdTech", "Ops", "WPP"],
    portfolioUrl: "https://anchit-boruah-online-portfolio.vercel.app/",
  },
] as const;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo: Vercel root is frontend/ — ensure parent outputs/ is traced for SSG pages
  outputFileTracingIncludes: {
    "/branding": ["../outputs/personal_branding.md"],
    "/resume/one-page": ["../outputs/resume_one_page.md"],
    "/resume/ats": ["../outputs/resume_ats_optimized.md"],
    "/workbench": ["../outputs/**/*.md", "../analysis/**/*.md"],
    "/workbench/intel/feed": ["../outputs/intel/feed/**/*.md"],
    "/workbench/intel/weekly": ["../outputs/intel/weekly/**/*.md", "../outputs/personal_branding.md"],
    "/workbench/intel/posts": [
      "../outputs/intel/posts/**/*.md",
      "../outputs/personal_branding.md",
      "../inputs/linkedin_style.md",
    ],
  },
};

export default nextConfig;

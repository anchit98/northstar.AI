export const WORKBENCH_NAV = [
  { href: "/workbench", icon: "dashboard", label: "Dashboard", exact: true },
  { href: "/workbench/outreach", icon: "mail", label: "Outreach" },
  { href: "/workbench/interview", icon: "forum", label: "Interview & Comp" },
  { href: "/workbench/positioning", icon: "layers", label: "Positioning" },
  { href: "/workbench/jd-alignment", icon: "psychology", label: "JD alignment" },
  { href: "/workbench/intel", icon: "newspaper", label: "Intel" },
  { href: "/workbench/versions", icon: "history", label: "Versions" },
  { href: "/workbench/feedback", icon: "insights", label: "Feedback" },
] as const;

/** Primary items in the mobile bottom bar; rest live in the “More” drawer. */
export const WORKBENCH_MOBILE_PRIMARY = [
  { href: "/workbench", icon: "dashboard", label: "Home", exact: true },
  { href: "/workbench/outreach", icon: "mail", label: "Outreach" },
  { href: "/workbench/intel", icon: "newspaper", label: "Intel" },
  { href: "/workbench/versions", icon: "history", label: "Versions" },
] as const;

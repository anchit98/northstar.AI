export type PublicNavItem =
  | { href: string; icon: string; label: string; external?: false }
  | { href: string; icon: string; label: string; external: true };

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/resume", icon: "description", label: "Resume" },
  { href: "/projects", icon: "folder_shared", label: "Projects" },
  { href: "/branding", icon: "auto_awesome", label: "Branding" },
  {
    href: "https://anchit-boruah-online-potfolio.vercel.app/",
    icon: "open_in_new",
    label: "Portfolio",
    external: true,
  },
];

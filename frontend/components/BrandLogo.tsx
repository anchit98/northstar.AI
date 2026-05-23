import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string | null;
  showWordmark?: boolean;
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 36, text: "text-headline-md" },
} as const;

export function BrandLogo({
  href = "/",
  showWordmark = true,
  size = "md",
  className,
}: BrandLogoProps) {
  const linked = href !== null;
  const { icon, text } = SIZES[size];

  const content = (
    <>
      <Image
        src="/northstar-logo.png"
        alt=""
        width={icon}
        height={icon}
        className="rounded-lg shrink-0"
        priority
      />
      {showWordmark && (
        <span className={cn("font-bold text-primary tracking-tight", text)}>
          NorthStar <span className="text-metrics-gold">AI</span>
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (linked && href) {
    return (
      <Link href={href} className={classes} aria-label="NorthStar AI home">
        {content}
      </Link>
    );
  }

  return <div className={classes} aria-label="NorthStar AI">{content}</div>;
}

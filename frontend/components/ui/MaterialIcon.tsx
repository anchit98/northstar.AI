import { cn } from "@/lib/utils";

type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

export function MaterialIcon({ name, className, filled }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", filled && "icon-fill", className)}
      aria-hidden
    >
      {name}
    </span>
  );
}

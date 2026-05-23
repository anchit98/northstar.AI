"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
  variant?: "primary" | "workbench";
};

export function CopyButton({
  text,
  label = "Copy",
  className,
  variant = "primary",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-label-md transition-opacity hover:opacity-90",
        variant === "workbench"
          ? "bg-private-workbench text-black"
          : "bg-primary-container text-on-primary-container",
        className
      )}
    >
      <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[18px]" />
      {copied ? "Copied" : label}
    </button>
  );
}

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

function processHookText(text: string): React.ReactNode[] {
  const parts = text.split(/(\[PERSONALIZATION_HOOK[^\]]*\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[PERSONALIZATION_HOOK")) {
      return (
        <mark key={i} className="hook-highlight not-italic">
          {part}
        </mark>
      );
    }
    return part;
  });
}

type MarkdownRendererProps = {
  content: string;
  className?: string;
  highlightHooks?: boolean;
};

export function MarkdownRenderer({
  content,
  className,
  highlightHooks = false,
}: MarkdownRendererProps) {
  return (
    <div className={cn("prose-career", className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div className="table-scroll">
            <table>{children}</table>
          </div>
        ),
        ...(highlightHooks
          ? {
              p: ({ children }) => (
                <p>
                  {React.Children.map(children, (child) =>
                    typeof child === "string" ? processHookText(child) : child
                  )}
                </p>
              ),
              li: ({ children }) => (
                <li>
                  {React.Children.map(children, (child) =>
                    typeof child === "string" ? processHookText(child) : child
                  )}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote>
                  {React.Children.map(children, (child) =>
                    typeof child === "string" ? processHookText(child) : child
                  )}
                </blockquote>
              ),
            }
          : {}),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}

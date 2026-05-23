"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function JdPasteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || undefined, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error || res.statusText);
        return;
      }
      setStatus("ok");
      setMessage(`Saved ${data.path}.`);
      setContent("");
      setTitle("");
      router.refresh();
    } catch {
      setStatus("err");
      setMessage("Network error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface-raised border border-border-subtle rounded-xl p-6">
      <h3 className="text-headline-md font-semibold text-on-surface flex items-center gap-2">
        <MaterialIcon name="post_add" className="text-primary" />
        Paste a new JD (MVP)
      </h3>
      <p className="text-sm text-on-surface-variant">
        Saves to <code className="text-primary">inputs/job_descriptions/&lt;title&gt;.md</code>. Requires workbench session
        (same browser). After saving, run synthesis and resume edits in the repo (Phase 11).
      </p>
      <div>
        <label className="block font-mono text-label-sm text-on-surface-variant mb-1">Title (optional, becomes filename)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-default border border-outline-variant rounded-lg px-3 py-2 text-on-surface"
          placeholder="e.g. Series-B-PLG-PM-Bangalore"
        />
      </div>
      <div>
        <label className="block font-mono text-label-sm text-on-surface-variant mb-1">Job description</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full bg-surface-default border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-mono text-sm"
          placeholder="Paste full JD text…"
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving" || !content.trim()}
        className="inline-flex items-center gap-2 rounded-full bg-private-workbench text-black px-5 py-2 font-mono text-label-md disabled:opacity-50"
      >
        <MaterialIcon name="save" className="text-[18px]" />
        {status === "saving" ? "Saving…" : "Save to corpus"}
      </button>
      {message && (
        <p className={status === "ok" ? "text-success-green text-sm" : "text-error text-sm"}>{message}</p>
      )}
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { SerializableArtifactManifest } from "@/lib/versionTypes";
import { VersionBadge } from "./VersionBadge";
import { VersionDiffViewer } from "./VersionDiffViewer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

type VersionHistoryExplorerProps = {
  manifests: SerializableArtifactManifest[];
  contentByArtifact: Record<string, Record<string, string>>;
};

export function VersionHistoryExplorer({ manifests, contentByArtifact }: VersionHistoryExplorerProps) {
  const resumeManifests = manifests.filter((m) => m.category === "resume");
  const defaultArtifact =
    resumeManifests[0]?.artifactPath ?? manifests.find((m) => m.current)?.artifactPath ?? manifests[0]?.artifactPath ?? "";

  const [artifactPath, setArtifactPath] = useState(defaultArtifact);
  const manifest = manifests.find((m) => m.artifactPath === artifactPath) ?? manifests[0];
  const versions = useMemo(() => {
    if (!manifest) return [];
    const list = [];
    if (manifest.current) list.push(manifest.current);
    list.push(...manifest.archived);
    return list;
  }, [manifest]);

  const [leftId, setLeftId] = useState(() => versions[1]?.versionId ?? versions[0]?.versionId ?? "current");
  const [rightId, setRightId] = useState(() => versions[0]?.versionId ?? "current");

  const contentMap = contentByArtifact[artifactPath] ?? {};
  const leftText = contentMap[leftId] ?? "";
  const rightText = contentMap[rightId] ?? "";
  const leftLabel = versions.find((v) => v.versionId === leftId)?.label ?? leftId;
  const rightLabel = versions.find((v) => v.versionId === rightId)?.label ?? rightId;

  if (!manifest) {
    return <p className="text-on-surface-variant">No versioned artifacts found in outputs/archive/.</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {manifests
          .filter((m) => m.current)
          .slice(0, 6)
          .map((m) => (
            <button
              key={m.artifactPath}
              type="button"
              onClick={() => {
                setArtifactPath(m.artifactPath);
                const opts = [...(m.current ? [m.current] : []), ...m.archived];
                setRightId(m.current?.versionId ?? "current");
                setLeftId(opts[1]?.versionId ?? opts[0]?.versionId ?? "current");
              }}
              className={cn(
                "text-left p-4 rounded-xl border transition-colors",
                artifactPath === m.artifactPath
                  ? "border-primary bg-primary/5"
                  : "border-border-subtle bg-surface-raised hover:border-outline-variant"
              )}
            >
              <p className="font-semibold text-on-surface mb-2">{m.displayName}</p>
              {m.current && (
                <VersionBadge
                  isCurrent
                  versionLabel={m.current.label.replace(" (current)", "")}
                  date={m.current.date}
                />
              )}
              {m.archived.length > 0 && (
                <p className="text-xs text-on-surface-variant mt-2 font-mono">
                  {m.archived.length} archived · latest {m.archived[0]?.versionId}
                </p>
              )}
            </button>
          ))}
      </section>

      <section className="bg-surface-raised border border-border-subtle rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-headline-md font-semibold flex items-center gap-2">
          <MaterialIcon name="compare" className="text-primary" />
          Compare any two versions
        </h2>
        <p className="text-sm text-on-surface-variant">
          EC-X.4: <code className="text-primary">outputs/</code> is always current; archives are read-only history (DEC-11).
        </p>

        <div className="flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-1 text-label-sm font-mono text-on-surface-variant">
            Artifact
            <select
              value={artifactPath}
              onChange={(e) => {
                const next = e.target.value;
                setArtifactPath(next);
                const m = manifests.find((x) => x.artifactPath === next);
                if (!m) return;
                const opts = [...(m.current ? [m.current] : []), ...m.archived];
                setRightId(m.current?.versionId ?? "current");
                setLeftId(opts[1]?.versionId ?? opts[0]?.versionId ?? "current");
              }}
              className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm w-full sm:w-auto sm:min-w-[200px]"
            >
              {manifests.map((m) => (
                <option key={m.artifactPath} value={m.artifactPath}>
                  {m.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-label-sm font-mono text-on-surface-variant">
            Left (older)
            <select
              value={leftId}
              onChange={(e) => setLeftId(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm"
            >
              {versions.map((v) => (
                <option key={v.versionId} value={v.versionId}>
                  {v.label} · {v.date}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-label-sm font-mono text-on-surface-variant">
            Right (newer)
            <select
              value={rightId}
              onChange={(e) => setRightId(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm"
            >
              {versions.map((v) => (
                <option key={v.versionId} value={v.versionId}>
                  {v.label} · {v.date}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              if (manifest.current) setRightId("current");
              setLeftId(manifest.archived[0]?.versionId ?? leftId);
            }}
            className="px-3 py-2 rounded-lg border border-primary/40 text-primary font-mono text-label-sm hover:bg-primary/10"
          >
            vs current
          </button>
        </div>

        {leftText && rightText ? (
          <VersionDiffViewer
            leftLabel={leftLabel}
            rightLabel={rightLabel}
            leftText={leftText}
            rightText={rightText}
            layout={manifest.diffLayout}
          />
        ) : (
          <p className="text-on-surface-variant text-sm">Select two versions that both exist for this artifact.</p>
        )}
      </section>

      <section>
        <h2 className="text-headline-md font-semibold mb-4">Version timeline — {manifest.displayName}</h2>
        <ol className="flex flex-col gap-3">
          {versions.map((v) => (
            <li
              key={v.versionId}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl border border-border-subtle bg-surface-container"
            >
              <VersionBadge isCurrent={v.isCurrent} versionLabel={v.label} date={v.date} />
              <div className="flex-1 min-w-0">
                {v.gatesPassed.length > 0 && (
                  <p className="text-xs font-mono text-primary mb-1">
                    Gates: {v.gatesPassed.join(", ")}
                    {v.phase ? ` · Phase ${v.phase}` : ""}
                  </p>
                )}
                {v.why && <p className="text-sm text-on-surface-variant">{v.why}</p>}
                <p className="text-xs font-mono text-on-surface-variant mt-1">sha:{v.sha256}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  className="text-xs font-mono text-primary hover:underline"
                  onClick={() => {
                    setLeftId(v.versionId);
                    if (manifest.current) setRightId("current");
                  }}
                >
                  Diff → current
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

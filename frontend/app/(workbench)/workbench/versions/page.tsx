import { getPhaseTimeline } from "@/lib/phaseTimeline";
import {
  buildArtifactContentMap,
  getArchiveFolderMetas,
  getVersionManifest,
  getVersionOptionsForArtifact,
} from "@/lib/versions";
import { PhaseTimeline } from "@/components/versions/PhaseTimeline";
import { VersionHistoryExplorer } from "@/components/versions/VersionHistoryExplorer";
import type { SerializableArtifactManifest } from "@/lib/versionTypes";

function toSerializable(manifests: ReturnType<typeof getVersionManifest>): SerializableArtifactManifest[] {
  return manifests.map((m) => ({
    artifactPath: m.artifactPath,
    displayName: m.displayName,
    diffLayout: m.diffLayout,
    category: m.category,
    current: m.current,
    archived: m.archived,
  }));
}

export default function VersionsPage() {
  const manifests = getVersionManifest();
  const serializable = toSerializable(manifests);
  const { phases, gates, parsedAt } = getPhaseTimeline();
  const archiveEvents = getArchiveFolderMetas();

  const contentByArtifact: Record<string, Record<string, string>> = {};
  for (const m of manifests) {
    const ids = getVersionOptionsForArtifact(m).map((v) => v.versionId);
    contentByArtifact[m.artifactPath] = buildArtifactContentMap(m.artifactPath, ids);
  }

  const currentResume = manifests.find((m) => m.artifactPath === "resume_ats_optimized.md")?.current;

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface mb-2">Version history</h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Trace how deliverables evolved (DEC-11). Archives in{" "}
          <code className="text-primary">outputs/archive/v*/</code>;{" "}
          <code className="text-primary">outputs/</code> is always the single source of truth (EC-X.4).
        </p>
        {currentResume && (
          <p className="font-mono text-label-sm text-on-surface-variant mt-3">
            Active resume bundle: {currentResume.label} · {currentResume.date}
          </p>
        )}
      </div>

      <section className="bg-surface-raised border border-border-subtle rounded-xl p-6">
        <PhaseTimeline phases={phases} gates={gates} />
        <p className="text-xs font-mono text-on-surface-variant mt-4">
          Timeline built {new Date(parsedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </section>

      {archiveEvents.length > 0 && (
        <section>
          <h2 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
            Archive events (_changelog.md)
          </h2>
          <ul className="flex flex-col gap-2">
            {archiveEvents.map((ev) => (
              <li
                key={ev.versionId}
                className="text-sm bg-surface-container border border-border-subtle rounded-lg p-3"
              >
                <span className="font-mono text-metrics-gold">{ev.versionId}</span>
                <span className="text-on-surface-variant mx-2">·</span>
                <span className="text-on-surface-variant">{ev.date}</span>
                {ev.gatesPassed.length > 0 && (
                  <span className="ml-2 font-mono text-xs text-primary">{ev.gatesPassed.join(", ")}</span>
                )}
                <p className="text-on-surface-variant mt-1 line-clamp-2">{ev.why}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <VersionHistoryExplorer manifests={serializable} contentByArtifact={contentByArtifact} />

      <footer className="font-mono text-label-sm text-on-surface-variant border-t border-outline-variant pt-6">
        Synced from outputs/ + outputs/archive/ · Phase 9 (G8) · EC-7.2 footer on artifact viewers
      </footer>
    </div>
  );
}

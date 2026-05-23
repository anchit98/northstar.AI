import { getSyncLabel, type ContentMeta } from "@/lib/content";

type SyncFooterProps = {
  meta: ContentMeta;
};

export function SyncFooter({ meta }: SyncFooterProps) {
  return (
    <footer className="mt-12 pt-6 border-t border-outline-variant no-print">
      <p className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
        {getSyncLabel(meta)}
        <span className="mx-2 text-outline-variant">·</span>
        {meta.date}
      </p>
    </footer>
  );
}

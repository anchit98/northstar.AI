export type DiffLayout = "split" | "unified";

export type SerializableVersionEntry = {
  versionId: string;
  label: string;
  date: string;
  sha256: string;
  isCurrent: boolean;
  why?: string;
  gatesPassed: string[];
  phase?: string;
};

export type SerializableArtifactManifest = {
  artifactPath: string;
  displayName: string;
  diffLayout: DiffLayout;
  category: string;
  current: SerializableVersionEntry | null;
  archived: SerializableVersionEntry[];
};

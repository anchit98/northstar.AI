import { WorkbenchShell } from "@/components/WorkbenchShell";

export default function WorkbenchLayout({ children }: { children: React.ReactNode }) {
  return <WorkbenchShell>{children}</WorkbenchShell>;
}

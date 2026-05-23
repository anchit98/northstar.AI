import "server-only";
import type { NextRequest } from "next/server";

const WORKBENCH_PASSCODE = process.env.WORKBENCH_PASSCODE || "northstar-dev";

export function isWorkbenchAuthorized(request: NextRequest): boolean {
  return request.cookies.get("workbench_auth")?.value === WORKBENCH_PASSCODE;
}

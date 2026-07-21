import { createServerFn } from "@tanstack/react-start";

import type { AuthContext } from "./auth-api";

export const fetchCurrentAuth = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthContext | null> => {
    const [{ getRequest }, { getCurrentAuth }] = await Promise.all([
      import("@tanstack/react-start/server"),
      import("@/server/modules/auth/auth.service"),
    ]);

    return getCurrentAuth(getRequest());
  },
);

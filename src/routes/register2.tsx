import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register2")({
  beforeLoad: () => {
    throw redirect({ to: "/register" });
  },
  component: () => null,
});

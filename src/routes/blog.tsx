import { createFileRoute, redirect } from "@tanstack/react-router";

// /blog est dépréciée — fusion avec /guides pour éviter la cannibalisation.
// 301 côté serveur (SSR + bots) ET côté client (navigation TanStack).
export const Route = createFileRoute("/blog")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/guides" },
        }),
    },
  },
  beforeLoad: () => {
    throw redirect({ to: "/guides", statusCode: 301 });
  },
});
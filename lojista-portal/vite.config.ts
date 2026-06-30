// Vite and TanStack configuration for the portal
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Vercel: preset explícito (default do Lovable é cloudflare-module → 404 na Vercel)
  nitro: { preset: "vercel" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

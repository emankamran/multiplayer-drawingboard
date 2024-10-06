import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import { createRoutesFromFolders } from '@remix-run/v1-route-convention';

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      routes(defineRoutes) {
        return createRoutesFromFolders(defineRoutes);
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    netlifyPlugin(),
    tsconfigPaths(), // Ensure this is correctly used
  ],
  server: {
    port: 3000,
  },
  
});


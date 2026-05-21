import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // Railway sets PORT; bind 0.0.0.0 so the container's HTTP gateway can reach us.
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 4173),
    // Allow any host header (Railway uses *.up.railway.app)
    allowedHosts: true,
  },
});

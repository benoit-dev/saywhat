import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App.tsx";
import "./styles.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

if (!convexUrl) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_CONVEX_URL — run `npx convex dev` once locally to bootstrap your Convex project, which will populate .env.local"
  );
}

const convex = new ConvexReactClient(convexUrl ?? "https://placeholder.convex.cloud");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>
);

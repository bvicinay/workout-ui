import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

async function bootstrap() {
  // Start MSW mock API in development when mocks are enabled
  if (import.meta.env.DEV) {
    const { MOCKS_ENABLED } = await import("./config");
    if (MOCKS_ENABLED) {
      const { worker } = await import("./mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        quiet: true,
      });
      console.log("[MSW] Mock API active");
    }
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();

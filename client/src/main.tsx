import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@/providers/AuthProvider";
import { IntentProvider } from "@/contexts/IntentContext";
import "./index.css";
import "./styles/theme-tokens.css";
import "./styles/light-contrast.css";

createRoot(document.getElementById("root")!).render(
  <IntentProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </IntentProvider>
);

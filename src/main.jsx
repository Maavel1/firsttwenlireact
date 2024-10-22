import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="firsttwenlireact.vercel.app"
      clientId="PhRlOFswGHmkTXd6grI34vobvYvCeQZi"
      redirectUri={window.location.origin} // Куда перенаправлять после успешного входа
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);

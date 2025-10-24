import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import EventContext from "./contexts/EventContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <EventContext>
        <App />
      </EventContext>
    </AuthContext>
  </BrowserRouter>
);

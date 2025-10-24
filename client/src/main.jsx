import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import EventContext from "./contexts/EventContext.jsx";
import PassContext from "./contexts/PassContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <EventContext>
        <PassContext>
          <App />
        </PassContext>
      </EventContext>
    </AuthContext>
  </BrowserRouter>
);

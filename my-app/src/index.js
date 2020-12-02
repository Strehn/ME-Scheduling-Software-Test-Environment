import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";
// for authentication using Auth0
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
const rootElement = document.getElementById("root");
ReactDOM.render(
    <Router>
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById("root")
);

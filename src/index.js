import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <App brandName="Notes" />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();

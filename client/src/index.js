import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import App from "./App";
import InitWeb3ContextProvider from "./context/InitWeb3Context.js";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <InitWeb3ContextProvider>
        <App />
      </InitWeb3ContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

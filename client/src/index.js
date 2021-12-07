import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import App from "./App";
import FavoritesContextProvider from "./context/FavoritesContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FavoritesContextProvider>
        <App />
      </FavoritesContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

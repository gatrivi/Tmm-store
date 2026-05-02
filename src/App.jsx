import { useState } from "react";
import reactLogo from "./assets/tmm.png";
import viteLogo from "/favicon.jpg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="layout">
      <div className="header">
        <a href="https://devtrivi.zengasoft.com" target="_blank">
          <img
            src={viteLogo}
            className="logo"
            style={{ borderRadius: "100%", margin: "10px" }}
            alt="Vite logo"
          />
        </a>
        <a href="https://gatrivi.carrd.co" target="_blank">
          <img
            src={reactLogo}
            className="logo react"
            style={{ borderRadius: "100%", margin: "10px" }}
            alt="React logo"
          />
        </a>
      </div>
      <h1>Trufi + TMM</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Asi de veces {count}
        </button>
        <p>
          Estamos trabajando desde <code>src/App.jsx</code> para que este sitio
          salga bien
        </p>
      </div>
      <p className="read-the-docs">Clickea en as caritas para ver mas </p>
    </div>
  );
}

export default App;

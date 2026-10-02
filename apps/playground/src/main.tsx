import "@rumahkodingku/editor-react/styles.css";
import "./app.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const container = document.getElementById("root");
if (!container) {
	throw new Error("Playground root element (#root) is missing.");
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

/**
 * External dependencies
 */
import React from "react";
import { render } from "@googleforcreators/react";
import "./assets/css/main.css";

/**
 * Internal dependencies
 */
import CreationTool from "./components/creationTool";

const initEditor = () => {};
render(<CreationTool />, document.getElementById("root"));

if ("loading" === document.readyState) {
  registerServiceWorker();
  document.addEventListener("DOMContentLoaded", initEditor);
} else {
  initEditor();
}

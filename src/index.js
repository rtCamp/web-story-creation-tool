/**
 * External dependencies
 */
import React from "react";
import { render } from "@googleforcreators/react";
import "./assets/css/main.css";
import styled from "styled-components";

/**
 * Internal dependencies
 */
import CreationTool from "./components/creationTool";
import { MediaProvider } from "./app/media";

const AppContainer = styled.div`
  height: 100vh;
`;

const initEditor = () => {};
render(
  <AppContainer>
    <MediaProvider>
      <CreationTool />
    </MediaProvider>
  </AppContainer>,
  document.getElementById("root")
);

if ("loading" === document.readyState) {
  registerServiceWorker();
  document.addEventListener("DOMContentLoaded", initEditor);
} else {
  initEditor();
}

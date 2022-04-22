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
import { StoryStatusProvider } from "./app/storyStatus";

const AppContainer = styled.div`
  height: 100vh;
`;

const initEditor = () => {};
render(
  <AppContainer>
    <StoryStatusProvider>
      <CreationTool />
    </StoryStatusProvider>
  </AppContainer>,
  document.getElementById("root")
);

if ("loading" === document.readyState) {
  registerServiceWorker();
  document.addEventListener("DOMContentLoaded", initEditor);
} else {
  initEditor();
}

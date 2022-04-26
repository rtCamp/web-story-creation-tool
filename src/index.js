/**
 * External dependencies
 */
import React from "react";
import { render } from "@googleforcreators/react";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/**
 * Internal dependencies
 */
import CreationTool from "./components/creationTool";
import { StoryStatusProvider, useStoryStatus } from "./app/storyStatus";
import registerServiceWorker from "../serviceWorkerRegistration";
import "./assets/css/main.css";
import Dashboard from "./components/dashboard";
import useIndexedDBMedia from "./app/indexedDBMedia/useIndexedDBMedia";

const AppContainer = styled.div`
  height: 100vh;
`;

const Editor = () => (
  <AppContainer>
    <CreationTool />
  </AppContainer>
);

const App = () => {
  useIndexedDBMedia();
  const { isInitializingIndexDB, isRefreshingMedia } = useStoryStatus(
    ({ state }) => ({
      isInitializingIndexDB: state.isInitializingIndexDB,
      isRefreshingMedia: state.isRefreshingMedia,
    })
  );
  return !isInitializingIndexDB && !isRefreshingMedia ? (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  ) : (
    <p>Please wait</p>
  );
};

const initEditor = () => {};
render(
  <StoryStatusProvider>
    <App />
  </StoryStatusProvider>,
  document.getElementById("root")
);

if ("loading" === document.readyState) {
  registerServiceWorker();
  document.addEventListener("DOMContentLoaded", initEditor);
} else {
  initEditor();
}

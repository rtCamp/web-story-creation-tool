/**
 * External dependencies
 */
import React from "react";
import { StoryEditor } from "@googleforcreators/story-editor";
import { elementTypes } from "@googleforcreators/element-library";
import { registerElementType } from "@googleforcreators/elements";
import styled from "styled-components";

/**
 * Internal dependencies
 */
import Layout from "./layout";
import { saveStoryById } from "../api/story";

const AppContainer = styled.div`
  height: 100vh;
`;

const CreationTool = () => {
  const apiCallbacks = {
    saveStoryById,
  };

  elementTypes.forEach(registerElementType);

  return (
    <AppContainer>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story: {} }}>
        <Layout />
      </StoryEditor>
    </AppContainer>
  );
};

export default CreationTool;

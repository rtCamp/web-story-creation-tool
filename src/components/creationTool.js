/**
 * External dependencies
 */
import React from "react";
import {
  StoryEditor,
  InterfaceSkeleton,
} from "@googleforcreators/story-editor";
import { elementTypes } from "@googleforcreators/element-library";
import { registerElementType } from "@googleforcreators/elements";
import styled from "styled-components";

/**
 * Internal dependencies
 */

const AppContainer = styled.div`
  height: 100vh;
`;

const CreationTool = () => {
  const apiCallbacks = {
    saveStoryById: () => Promise.resolve({}),
  };

  elementTypes.forEach(registerElementType);

  return (
    <AppContainer>
      <StoryEditor config={{ apiCallbacks }} initialEdits={{ story: {} }}>
        <InterfaceSkeleton />
      </StoryEditor>
    </AppContainer>
  );
};

export default CreationTool;

/**
 * External dependencies
 */
import React, { useMemo } from "react";
import { StoryEditor } from "@googleforcreators/story-editor";
import { elementTypes } from "@googleforcreators/element-library";
import { registerElementType } from "@googleforcreators/elements";

/**
 * Internal dependencies
 */
import Layout from "./layout";
import { LOCAL_STORAGE_CONTENT_KEY } from "../consts";
import { saveStoryById, getFonts } from "../api";

function getInitialStory() {
  const savedStory = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  return savedStory ? JSON.parse(savedStory) : {};
}

const CreationTool = () => {
  const config = useMemo(() => {
    return {
      autoSaveInterval: 5,
      capabilities: {
        hasUploadMediaAction: true,
      },
      apiCallbacks: {
        updateCurrentUser: () => Promise.resolve({}),
        getFonts,
        saveStoryById,
      },
    };
  }, []);

  elementTypes.forEach(registerElementType);

  return (
    <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
      <Layout />
    </StoryEditor>
  );
};

export default CreationTool;

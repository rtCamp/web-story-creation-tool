/**
 * External dependencies
 */
import React, { useEffect, useMemo } from "react";
import { StoryEditor } from "@googleforcreators/story-editor";
import { elementTypes } from "@googleforcreators/element-library";
import { registerElementType } from "@googleforcreators/elements";

/**
 * Internal dependencies
 */
import Layout from "./layout";
import { LOCAL_STORAGE_CONTENT_KEY } from "../consts";
import { saveStoryById, getFonts } from "../api";
import useIndexedDBMedia from "../app/useIndexedDBMedia";

function getInitialStory() {
  const savedStory = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  return savedStory ? JSON.parse(savedStory) : {};
}

const CreationTool = () => {
  const { isInitialized, getMedia } = useIndexedDBMedia();
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
        getMedia,
      },
    };
  }, []);

  elementTypes.forEach(registerElementType);

  return isInitialized ? (
    <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
      <Layout />
    </StoryEditor>
  ) : (
    <p>Please wait</p>
  );
};

export default CreationTool;

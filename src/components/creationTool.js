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
import { saveStoryById, getFonts } from "../api/editor";
import useIndexedDBMedia from "../app/indexedDBMedia/useIndexedDBMedia";
import MediaUpload from "./mediaUpload";
import { getMedia, updateMedia, deleteMedia, uploadMedia } from "../api/editor";
import { useStoryStatus } from "../app/storyStatus";

function getInitialStory() {
  const savedStory = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  return savedStory ? JSON.parse(savedStory) : {};
}

const CreationTool = () => {
  useIndexedDBMedia();
  const { isInitializingIndexDB, isRefreshingMedia } = useStoryStatus(
    ({ state }) => ({
      isInitializingIndexDB: state.isInitializingIndexDB,
      isRefreshingMedia: state.isRefreshingMedia,
    })
  );
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
        uploadMedia,
        updateMedia,
        deleteMedia,
      },
      MediaUpload,
    };
  }, []);

  elementTypes.forEach(registerElementType);

  return !isInitializingIndexDB && !isRefreshingMedia ? (
    <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
      <Layout />
    </StoryEditor>
  ) : (
    <p>Please wait</p>
  );
};

export default CreationTool;

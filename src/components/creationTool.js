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
import MediaUpload from "./MediaUpload";
import { MediaProvider, useMedia } from "../app/media";
import { saveStoryById, getFonts } from "../api";

function getInitialStory() {
  const savedStory = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  return savedStory ? JSON.parse(savedStory) : {};
}

const CreationTool = () => {
  const {
    actions: {
      updateMediaCallback,
      uploadMediaCallback,
      getMediaCallback,
      deleteMedia,
    },
  } = useMedia(({ state, actions }) => {
    return { state, actions };
  });

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
        getMedia: getMediaCallback,
        updateMedia: updateMediaCallback,
        uploadMedia: uploadMediaCallback,
        deleteMedia,
      },
      MediaUpload,
    };
  }, [updateMediaCallback, uploadMediaCallback, getMediaCallback, deleteMedia]);

  elementTypes.forEach(registerElementType);

  return (
    <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
      <Layout />
    </StoryEditor>
  );
};

export default CreationTool;

/**
 * External dependencies
 */
import React, { useEffect, useMemo, useState } from "react";
import { StoryEditor } from "@googleforcreators/story-editor";
import { elementTypes } from "@googleforcreators/element-library";
import { registerElementType } from "@googleforcreators/elements";
import { v4 as uuidv4 } from "uuid";

/**
 * Internal dependencies
 */
import Layout from "./layout";
import { saveStoryById, getFonts } from "../api/editor";
import MediaUpload from "./mediaUpload";
import { useStoryStatus } from "../app/storyStatus";
import {
  getMedia,
  updateMedia,
  deleteMedia,
  uploadMedia,
  getStoryById,
} from "../api/editor";

const CreationTool = () => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");
  const { isInitializingIndexDB } = useStoryStatus(({ state }) => ({
    isInitializingIndexDB: state.isInitializingIndexDB,
  }));

  const [story, setStory] = useState();

  const config = useMemo(() => {
    return {
      storyId: id ? id : uuidv4(),
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
  }, [id]);

  elementTypes.forEach(registerElementType);

  useEffect(() => {
    const hydrateStory = async () => {
      const s = (id)?await getStoryById(id):{};
      setStory(s);
    };
    if (!isInitializingIndexDB) {
      hydrateStory();
    }
  }, [isInitializingIndexDB]);

  if (!story) {
    return <p>Please wait</p>;
  }

  return (
    <StoryEditor config={config} initialEdits={{ story }}>
      <Layout />
    </StoryEditor>
  );
};

export default CreationTool;

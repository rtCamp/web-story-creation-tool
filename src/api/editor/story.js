/**
 * External dependencies
 */
import React from "react";
import { DATA_VERSION } from "@googleforcreators/migration";
import { OutputStory } from "@googleforcreators/output";
/**
 * Internal dependencies
 */
import { LOCAL_STORAGE_PREVIEW_MARKUP_KEY } from "../../consts";
import { renderToStaticMarkup } from "react-dom/server";
import {
  addStoryToDB,
  getStoryIdsInDB,
  getStoryInDB,
  updateStoryInDB,
} from "../../utils";

export const saveStoryById = async ({
  pages,
  globalStoryStyles,
  autoAdvance,
  defaultPageDuration,
  currentStoryStyles,
  backgroundAudio,
  title,
  excerpt,
  storyId,
}) => {
  const storySaveData = {
    storyId,
    title: {
      raw: title,
    },
    excerpt: {
      raw: excerpt,
    },
    storyData: {
      version: DATA_VERSION,
      pages,
      autoAdvance,
      defaultPageDuration,
      currentStoryStyles,
      backgroundAudio,
    },
    author: {
      id: 1,
      name: "",
    },
    stylePresets: globalStoryStyles,
    permalinkTemplate: "https://example.org/web-stories/%pagename%/",
  };

  // save markup in local storage.
  window.localStorage.setItem(
    LOCAL_STORAGE_PREVIEW_MARKUP_KEY,
    renderToStaticMarkup(
      <OutputStory
        story={{
          featuredMedia: "",
          link: "",
          title,
          autoAdvance,
          defaultPageDuration,
          backgroundAudio,
          publisherLogo: "",
        }}
        pages={pages}
        metadata={{ publisher: "" }}
        flags={{ allowBlobs: true }}
      />
    )
  );

  //add or update story in indexedDB

  const storyIdsInDB = await getStoryIdsInDB();

  if (storyIdsInDB.includes(storyId)) {
    await updateStoryInDB(storySaveData);
  } else {
    await addStoryToDB(storySaveData);
  }

  return {};
};

export const getStoryById = async (id) => {
  const story = await getStoryInDB(id);
  return story ? story : {};
};

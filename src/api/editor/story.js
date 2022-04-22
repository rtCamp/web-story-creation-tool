/**
 * External dependencies
 */
import React from "react";
import { DATA_VERSION } from "@googleforcreators/migration";
import { OutputStory } from "@googleforcreators/output";
/**
 * Internal dependencies
 */
import {
  LOCAL_STORAGE_PREVIEW_MARKUP_KEY,
  LOCAL_STORAGE_CONTENT_KEY,
} from "../../consts";
import { renderToStaticMarkup } from "react-dom/server";

export const saveStoryById = ({
  pages,
  globalStoryStyles,
  autoAdvance,
  defaultPageDuration,
  currentStoryStyles,
  backgroundAudio,
  title,
  excerpt,
}) => {
  const storySaveData = {
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

  window.localStorage.setItem(
    LOCAL_STORAGE_CONTENT_KEY,
    JSON.stringify(storySaveData)
  );
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

  return Promise.resolve({});
};

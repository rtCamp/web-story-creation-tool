/**
 * External dependencies
 */
import { migrate } from "@googleforcreators/migration";
import { createPage } from "@googleforcreators/elements";

function getInitialStoryState() {
  const globalStoryStyles = {
    colors: [],
    textStyles: [],
  };

  // If there are no pages, create empty page.
  const storyData = migrate([], 0);
  const pages = storyData?.pages?.length > 0 ? storyData.pages : [createPage()];

  // Set story-global variables.
  const story = {
    title: "",
    storyId: 1,
    currentStoryStyles: {
      colors: storyData?.currentStoryStyles?.colors
        ? getUniquePresets(storyData.currentStoryStyles.colors)
        : [],
    },
    globalStoryStyles,
    autoAdvance: storyData?.autoAdvance,
    defaultPageDuration: storyData?.defaultPageDuration,
  };

  return {
    pages,
    story,
    selection: [],
    current: null, // will be set to first page by `restore`
  };
}

export default getInitialStoryState;

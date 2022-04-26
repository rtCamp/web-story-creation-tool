import { getStoriesInDB } from "../../utils";

export const fetchStories = async () => {
  const stories = await getStoriesInDB();
  const fetchedStoryIds = [];
  const treatedStories = stories.reduce((acc, story) => {
    fetchedStoryIds.push(story.storyId);

    acc[story.storyId] = {
      author: story.author,
      capabilities: {
        hasEditAction: true,
        hasDeleteAction: false,
      },
      id: story.storyId,
      created: story?.created,
      createdGMT: story?.createdGMT,
      editStoryLink: `/editor?id=${story.storyId}`,
      featuredMediaUrl: story?.featuredMediaUrl,
      modified: story?.modified,
      modifiedGMT: story?.modifiedGMT,
      status: story.status ? story.status : "publish",
      title: story?.title?.raw,
    };
    return acc;
  }, {});

  return {
    stories: treatedStories,
    fetchedStoryIds,
    totalPages: fetchedStoryIds.length === 0 ? 0 : 1,
    totalStoriesByStatus: {
      all: fetchedStoryIds.length,
      publish: fetchedStoryIds.length,
    },
  };
};

/**
 * Trash stories.
 *
 * @param {number|string} storyId Story Id.
 * @return {Promise} Request promise.
 */
export function trashStory(storyId) {}

/**
 * Update story.
 *
 * @param {Object} story Story object.
 * @return {Promise} Request promise.
 */
export function updateStory(story) {}

import { deleteStoryInDB, getStoriesInDB, updateStoryInDB } from "../../utils";
import { getStoryById } from "../editor";

export const fetchStories = async () => {
  const stories = await getStoriesInDB();
  const fetchedStoryIds = [];
  const treatedStories = stories.reduce((acc, story) => {
    fetchedStoryIds.push(story.storyId);

    acc[story.storyId] = {
      author: story.author,
      capabilities: {
        hasEditAction: true,
        hasDeleteAction: true,
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
export const trashStory = async (storyId) => {
  await deleteStoryInDB(storyId);
};

/**
 * Update story.
 *
 * @param {Object} story Story object.
 * @return {Promise} Request promise.
 */
export const updateStory = async ({ id, author, title }) => {
  try {
    if (!id) {
      return;
    }
    const story = await getStoryById(id);
    if (author) {
      story.author = author;
    }
    if (title) {
      story.title = title;
    }
    await updateStoryInDB(story);
    return {
      author: story.author,
      capabilities: {
        hasEditAction: true,
        hasDeleteAction: true,
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
  } catch (error) {
    throw error;
  }
};

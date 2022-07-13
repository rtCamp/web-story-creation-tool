/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { getStoryById } from '../editor';
import { deleteStoryInDB, getStoriesInDB, updateStoryInDB } from '../../utils';

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
      editStoryLink: `/web-story-creation-tool/editor.html?id=${story.storyId}`,
      featuredMediaUrl: story?.featuredMediaUrl,
      modified: story?.modified,
      modifiedGMT: story?.modifiedGMT,
      status: story.status ? story.status : 'publish',
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
 * @param story.id
 * @param story.author
 * @param story.title
 * @return {Promise} Request promise.
 */
export const updateStory = async ({ id, author, title }) => {
  if (!id) {
    return {};
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
    status: story.status ? story.status : 'publish',
    title: story?.title?.raw,
  };
};

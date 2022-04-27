/*
 * Copyright 2021 Google LLC
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
 * External dependencies
 */
import { DATA_VERSION } from '@googleforcreators/migration';
import { OutputStory } from '@googleforcreators/output';
/**
 * Internal dependencies
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { LOCAL_STORAGE_PREVIEW_MARKUP_KEY } from '../../consts';
import {
  addStoryToDB,
  getStoryIdsInDB,
  getStoryInDB,
  updateStoryInDB,
} from '../../utils';

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
      name: '',
    },
    stylePresets: globalStoryStyles,
    permalinkTemplate: 'https://example.org/web-stories/%pagename%/',
  };

  // save markup in local storage.
  window.localStorage.setItem(
    LOCAL_STORAGE_PREVIEW_MARKUP_KEY,
    renderToStaticMarkup(
      <OutputStory
        story={{
          featuredMedia: '',
          link: '',
          title,
          autoAdvance,
          defaultPageDuration,
          backgroundAudio,
          publisherLogo: '',
        }}
        pages={pages}
        metadata={{ publisher: '' }}
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

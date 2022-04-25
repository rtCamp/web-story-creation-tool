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
 * External dependencies
 */
import { useMemo } from '@googleforcreators/react';
import { StoryEditor } from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { LOCAL_STORAGE_CONTENT_KEY } from '../consts';
import {
  saveStoryById,
  getFonts,
  getMedia,
  updateMedia,
  deleteMedia,
  uploadMedia,
} from '../api';
import useIndexedDBMedia from '../app/IndexedDBMedia/useIndexedDBMedia';
import { useStoryStatus } from '../app/storyStatus';
import MediaUpload from './MediaUpload';
import Layout from './layout';

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
    // eslint-disable-next-line react/jsx-no-literals -- just because i dont want eslint to catch this error.
    <p>Please wait</p>
  );
};

export default CreationTool;

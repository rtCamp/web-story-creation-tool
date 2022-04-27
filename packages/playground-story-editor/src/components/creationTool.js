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
import { useEffect, useMemo, useState } from '@googleforcreators/react';
import { StoryEditor } from '@googleforcreators/story-editor';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  saveStoryById,
  getFonts,
  getMedia,
  updateMedia,
  deleteMedia,
  uploadMedia,
  getStoryById,
} from '../api/editor';
import { useStoryStatus } from '../app/storyStatus';
import Layout from './layout';
import MediaUpload from './MediaUpload';

const CreationTool = () => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');
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
      const s = id ? await getStoryById(id) : {};
      setStory(s);
    };
    if (!isInitializingIndexDB) {
      hydrateStory();
    }
  }, [isInitializingIndexDB, id]);

  if (!story) {
    return <p>{'Please wait'}</p>;
  }

  return (
    <StoryEditor config={config} initialEdits={{ story }}>
      <Layout />
    </StoryEditor>
  );
};

export default CreationTool;

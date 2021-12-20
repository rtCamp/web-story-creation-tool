/*
 * Copyright 2020 Google LLC
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
import { render, useMemo } from '@web-stories-wp/react';
import StoryEditor from '@web-stories-wp/story-editor';
import { DATA_VERSION } from '@web-stories-wp/migration';
import styled from 'styled-components';

/**
 * Internal dependencies
 */

import registerServiceWorker from './serviceWorkerRegistration';
import Layout from './components/layout';
import { defaultStory } from './consts';
import MediaUpload from './components/MediaUpload';
import '../public/main.css';
import { MediaProvider, useMedia } from './app/media';

const AppContainer = styled.div`
  height: 100vh;
`;

const apiCallbacksNames = [
  'getAuthors',
  'getStoryById',
  'getDemoStoryById',
  'saveStoryById',
  'autoSaveById',
  'getMedia',
  'getMediaById',
  'getMutedMediaById',
  'getOptimizedMediaById',
  'uploadMedia',
  'updateMedia',
  'deleteMedia',
  'getLinkMetadata',
  'getCustomPageTemplates',
  'addPageTemplate',
  'deletePageTemplate',
  'getCurrentUser',
  'updateCurrentUser',
  'getHotlinkInfo',
  'getProxyUrl',
  'getPublisherLogos',
  'addPublisherLogo',
  'getTaxonomies',
  'getTaxonomyTerm',
  'createTaxonomyTerm',
];

function getInitialStory() {
  const savedStory = window.localStorage.getItem('saved_story');
  return savedStory ? JSON.parse(savedStory) : defaultStory;
}

const apiCallbacks = apiCallbacksNames.reduce((callbacks, name) => {
  let response;

  switch (name) {
    case 'getCurrentUser':
      response = { id: 1 };
      break;
    case 'getPublisherLogos':
      response = [{ url: '' }];
      break;
    default:
      response = {};
  }

  if ('saveStoryById' === name) {
    callbacks[name] = (_story) => {
      window.localStorage.setItem('preview_markup', _story?.content);
      window.localStorage.setItem(
        'saved_story',
        JSON.stringify({
          ...defaultStory,
          story_data: { ..._story, version: DATA_VERSION },
          title: { raw: _story.title ? _story.title : '' },
          excerpt: { raw: _story.excerpt ? _story.excerpt : '' },
        })
      );
      return Promise.resolve(_story);
    };
  } else {
    callbacks[name] = () => Promise.resolve(response);
  }

  return callbacks;
}, {});

const CoreEditor = () => {
  const { updateMediaCallback, getMediaCallback, deleteMedia } = useMedia(
    ({ actions: { updateMediaCallback, getMediaCallback, deleteMedia } }) => {
      return {
        updateMediaCallback,
        getMediaCallback,
        deleteMedia,
      };
    }
  );
  const config = useMemo(() => {
    return {
      autoSaveInterval: 5,
      showMediaLocal: true,
      capabilities: {
        hasUploadMediaAction: true,
      },
      apiCallbacks: {
        ...apiCallbacks,
        getMedia: getMediaCallback,
        updateMedia: updateMediaCallback,
        deleteMedia,
      },
      MediaUpload,
    };
  }, [updateMediaCallback, getMediaCallback, deleteMedia]);
  return (
    <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
      <Layout />
    </StoryEditor>
  );
};

const Playground = () => {
  return (
    <AppContainer>
      <MediaProvider>
        <CoreEditor />
      </MediaProvider>
    </AppContainer>
  );
};

const initEditor = () => {};
render(<Playground />, document.getElementById('playground-root'));

if ('loading' === document.readyState) {
  document.addEventListener('DOMContentLoaded', initEditor);
  registerServiceWorker();
} else {
  initEditor();
}

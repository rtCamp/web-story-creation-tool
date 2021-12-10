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
import { render } from '@web-stories-wp/react';
import StoryEditor from '@web-stories-wp/story-editor';
import { DATA_VERSION } from '@web-stories-wp/migration';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { StoryDownloadProvider } from './app/storyDownload';
import Layout from './components/layout';

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

const defaultStory = {
  title: { raw: '' },
  excerpt: { raw: '' },
  permalink_template: 'https://example.org/web-stories/%pagename%/',
  style_presets: {
    colors: [],
    textStyles: [],
  },
  date: '2021-10-26T12:38:38', // Publishing field breaks if date is not provided.
};

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

const config = {
  showMediaLocal: false,
  apiCallbacks,
};

const Playground = () => (
  <AppContainer>
    <StoryDownloadProvider>
      <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
        <Layout />
      </StoryEditor>
    </StoryDownloadProvider>
  </AppContainer>
);

render(<Playground />, document.getElementById('playground-root'));

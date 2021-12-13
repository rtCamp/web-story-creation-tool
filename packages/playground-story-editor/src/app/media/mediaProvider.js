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
import PropTypes from 'prop-types';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from '@web-stories-wp/react';

import { useConfig } from '@web-stories-wp/story-editor';

/**
 * Internal dependencies
 */
import MediaContext from './context';
import { getDummyMedia } from './utils';

function MediaProvider({ children }) {
  const [media, _updateMedia] = useState([]);

  const loadMockedFiles = useCallback(() => {
    _updateMedia(getDummyMedia());
  }, []);

  useEffect(() => {
    loadMockedFiles();
  }, [loadMockedFiles]);

  const handleFileInput = useCallback((event) => {
    console.log('onChange');
    console.log(event.target.files);
  }, []);

  const getMedia = () => {
    return Promise.resolve({
      data: media,
      headers: {
        totalItems: media.length,
        totalPages: 1,
      },
    });
  };
  const updateMedia = () => {
    return Promise.resolve(getDummyMedia());
  };

  const value = {
    actions: {
      getMedia,
      updateMedia,
      handleFileInput,
    },

    state: {
      media,
    },
  };
  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
}

MediaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MediaProvider;

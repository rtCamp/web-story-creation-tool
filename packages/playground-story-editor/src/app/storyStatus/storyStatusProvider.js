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
import PropTypes from 'prop-types';
import { useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Context from './context';

function StoryStatusProvider({ children }) {
  const [isInitializingIndexDB, updateIsInitializingIndexDB] = useState(true);
  const [isImporting, updateIsImporting] = useState(false);
  const [isExporting, updateIsExporting] = useState(false);
  const [isRefreshingMedia, updateIsRefreshingMedia] = useState(true);
  const [isUpdatingStoryAssets, updateIsUpdatingStoryAssets] = useState(true);

  const value = {
    state: {
      isInitializingIndexDB,
      isImporting,
      isExporting,
      isRefreshingMedia,
      isUpdatingStoryAssets,
    },
    actions: {
      updateIsInitializingIndexDB,
      updateIsImporting,
      updateIsExporting,
      updateIsRefreshingMedia,
      updateIsUpdatingStoryAssets,
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

StoryStatusProvider.propTypes = {
  children: PropTypes.node,
};

export default StoryStatusProvider;

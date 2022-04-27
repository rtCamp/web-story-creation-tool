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

import { useEffect, useCallback } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import {
  getMediaFromDB,
  initDB,
  replaceMediaInDB,
  getResourceFromLocalFile,
} from '../../utils';
import { useStoryStatus } from '../storyStatus';

const useIndexedDBMedia = () => {
  const { updateIsInitializingIndexDB, updateIsRefreshingMedia } =
    useStoryStatus(({ actions }) => ({
      updateIsInitializingIndexDB: actions.updateIsInitializingIndexDB,
      updateIsRefreshingMedia: actions.updateIsRefreshingMedia,
    }));

  const _refreshMedia = async () => {
    const mediaInDB = await getMediaFromDB();
    const newData = [];

    await Promise.all(
      mediaInDB.map(async (mediaItem) => {
        if (mediaItem.mediaSource === 'poster-generation') {
          return;
        }

        const { resource: mediaData } = await getResourceFromLocalFile(
          mediaItem.file
        );
        const updatedMediaItem = {
          ...mediaItem,
          src: mediaData.src,
          local: false, // this disables the UploadingIndicator
        };
        if ('video' === mediaItem?.type) {
          const posterItem = mediaInDB.find((m) => m.id === mediaItem.posterId);
          posterItem.src = mediaData.poster;
          updatedMediaItem.poster = mediaData.poster;

          newData.push(posterItem);
        }
        newData.push(updatedMediaItem);
      })
    );
    await replaceMediaInDB(newData);
  };

  const _onMountRoutine = useCallback(async () => {
    updateIsInitializingIndexDB(true);
    await initDB();
    updateIsInitializingIndexDB(false);

    updateIsRefreshingMedia(true);
    await _refreshMedia();
    updateIsRefreshingMedia(false);
  }, [updateIsInitializingIndexDB, updateIsRefreshingMedia]);

  useEffect(() => {
    _onMountRoutine();
  }, [_onMountRoutine]);

  return {
    isIndexedDBSupported: window.indexedDB,
  };
};

export default useIndexedDBMedia;

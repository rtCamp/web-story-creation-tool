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
import { v4 as uuidv4 } from 'uuid';
import { useState, useCallback } from '@web-stories-wp/react';
import { useSnackbar } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import MediaContext from './context';
import { getResourceFromLocalFile, isValidFile } from './utils';

function MediaProvider({ children }) {
  const [media, updateMedia] = useState([]);
  const [isInitialMount, updateIsInitialMount] = useState(true);

  const { showSnackbar } = useSnackbar();

  const addLocalFiles = useCallback(
    async (files) => {
      const mediaItems = [];

      await Promise.all(
        [...files].map(async (file) => {
          try {
            isValidFile(file);
            const { resource: mediaData } = await getResourceFromLocalFile(
              file
            );
            mediaData.local = false; // this disables the UploadingIndicator
            mediaData.id = uuidv4();
            mediaData.file = file;
            mediaData.modifiedAt = new Date().getTime();
            mediaItems.push(mediaData);
          } catch (e) {
            showSnackbar({
              message: e.message,
            });
          }
        })
      );
      updateMedia((prevMedia) => [...prevMedia, ...mediaItems]);
    },
    [updateMedia, showSnackbar]
  );

  const getMedia = useCallback(() => {
    return Promise.resolve({
      data: media,
      headers: {
        totalItems: media.length,
        totalPages: 1,
      },
    });
  }, [media]);

  const deleteMedia = useCallback(
    (mediaId) => {
      const filteredMedia = media.filter(
        (mediaItem) => mediaItem.id !== mediaId
      );
      updateMedia(filteredMedia);
    },
    [media]
  );

  const updateMediaCallback = useCallback(
    async (mediaId, data) => {
      if (!mediaId) {
        await addLocalFiles(data.files);
      } else {
        updateMedia((prevMedia) => {
          const updated = prevMedia.map((mediaItem) => {
            if (mediaId !== mediaItem.id) {
              return mediaItem;
            } else {
              mediaItem.alt = data.alt_text ? data.alt_text : mediaItem.alt;
              return mediaItem;
            }
          });
          return updated;
        });
      }
    },
    [addLocalFiles]
  );

  const value = {
    actions: {
      getMediaCallback: getMedia,
      updateMediaCallback,
      deleteMedia,
      updateIsInitialMount,
      addLocalFiles,
      updateMedia,
    },

    state: {
      media,
      isInitialMount,
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

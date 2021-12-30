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
import { getFileName } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import MediaContext from './context';
import { getResourceFromLocalFile, isValidFile } from './utils';

function MediaProvider({ children }) {
  const [media, updateMedia] = useState([]);
  const [isInitialMount, updateIsInitialMount] = useState(true);

  const addLocalFiles = useCallback(
    async (files) => {
      const mediaItems = [];

      await Promise.all(
        [...files].map(async (file) => {
          try {
            isValidFile(file); // this will throw an error.
            const mediaTitles = media.map((mediaItem) => mediaItem.title);
            if (mediaTitles.includes(getFileName(file))) {
              return;
            }
            const { resource: mediaData } = await getResourceFromLocalFile(
              file
            );
            mediaData.local = false; // this disables the UploadingIndicator
            mediaData.id = uuidv4();
            mediaData.file = file;
            mediaData.modifiedAt = new Date().getTime();
            mediaItems.push(mediaData);
          } catch (e) {
            //TODO:Add snackbar or alert
          }
        })
      );
      updateMedia((prevMedia) => {
        const prevMediaTitles = prevMedia.map((mediaItem) => mediaItem.alt);
        const filteredMedia = mediaItems.filter(
          (mediaItem) => !prevMediaTitles.includes(mediaItem.alt)
        );
        return [...prevMedia, ...filteredMedia];
      });
    },
    [updateMedia, media]
  );

  const restoreMediaFromDb = useCallback(
    async (mediaListInDb) => {
      const mediaItems = [];

      await Promise.all(
        mediaListInDb.map(async (mediaItemInDb) => {
          try {
            const { resource: mediaData } = await getResourceFromLocalFile(
              mediaItemInDb.file
            );
            mediaItems.push({
              ...mediaItemInDb,
              local: false, // this disables the UploadingIndicator
              src: mediaData.src,
            });
          } catch (e) {
            //TODO:Add snackbar or alert
          }
        })
      );
      updateMedia((prevMedia) => {
        const prevMediaTitles = prevMedia.map((mediaItem) => mediaItem.alt);
        const filteredMedia = mediaItems.filter(
          (mediaItem) => !prevMediaTitles.includes(mediaItem.alt)
        );
        return [...prevMedia, ...filteredMedia];
      });
    },
    [updateMedia]
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

  const uploadMediaCallback = async (file) => {
    if (Object.prototype.toString.call(file).includes('Blob')) {
      return;
    }
    await addLocalFiles([file]);
  };

  const updateMediaCallback = useCallback((mediaId, data) => {
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
  }, []);

  const value = {
    actions: {
      getMediaCallback: getMedia,
      updateMediaCallback,
      uploadMediaCallback,
      deleteMedia,
      updateIsInitialMount,
      addLocalFiles,
      restoreMediaFromDb,
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

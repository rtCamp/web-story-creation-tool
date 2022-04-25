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
/* eslint-disable eslint-comments/disable-enable-pair -- to enable the below exemption */

/* eslint-disable no-useless-catch -- just need to avoid unnecessary eslinting*/
/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  getFromDB,
  updateInDB,
  deleteInDB,
  addToDB,
  getResourceFromLocalFile,
} from '../utils';

export const getMedia = async ({ mediaType, searchTerm }) => {
  try {
    let filteredMedia = await getFromDB();

    // remove poster

    filteredMedia = filteredMedia.filter(
      (mediaItem) => mediaItem.mediaSource !== 'poster-generation'
    );
    if (mediaType) {
      filteredMedia = filteredMedia.filter(
        (mediaItem) => mediaType === mediaItem.type
      );
    }
    if (searchTerm) {
      filteredMedia = filteredMedia.filter((mediaItem) =>
        mediaItem.title.includes(searchTerm)
      );
    }
    return {
      data: filteredMedia,
      headers: {
        totalItems: filteredMedia.length,
        totalPages: 1,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const uploadMedia = async (file, additionalData) => {
  let { resource: mediaData } = await getResourceFromLocalFile(file);
  mediaData = {
    ...mediaData,
    local: false, // this disables the UploadingIndicator
    id: uuidv4(),
    file,
    modifiedAt: new Date().getTime(),
    ...additionalData,
    alt: additionalData?.altText ? additionalData.altText : mediaData.alt,
  };

  if (additionalData?.mediaSource === 'poster-generation') {
    // if a Poster is being uploaded update respective video asset
    const videoMediaId = additionalData.mediaId;
    await updateInDB(videoMediaId, {
      posterId: mediaData.id,
      modifiedAt: new Date().getTime(),
    });
  }
  await addToDB(mediaData);
};

export const updateMedia = async (mediaId, data) => {
  try {
    await updateInDB(mediaId, data);
  } catch (error) {
    throw error;
  }
};

export const deleteMedia = async (mediaId) => {
  try {
    const mediaItemsInDB = await getFromDB();
    const mediaItem = mediaItemsInDB.find((m) => m.id === mediaId);

    if (mediaItem.type === 'video') {
      await deleteInDB(mediaItem.posterId);
    }
    await deleteInDB(mediaId);
  } catch (error) {
    throw error;
  }
};

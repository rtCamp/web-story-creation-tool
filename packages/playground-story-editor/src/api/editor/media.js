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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  getMediaFromDB,
  updateMediaInDB,
  deleteMediaInDB,
  addMediaToDB,
  getResourceFromLocalFile,
} from '../../utils';

export const getMedia = async ({ mediaType, searchTerm }) => {
  let filteredMedia = await getMediaFromDB();

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
    await updateMediaInDB(videoMediaId, {
      posterId: mediaData.id,
      modifiedAt: new Date().getTime(),
    });
  }
  await addMediaToDB(mediaData);
};

export const updateMedia = async (mediaId, data) => {
  await updateMediaInDB(mediaId, data);
};

export const deleteMedia = async (mediaId) => {
  const mediaItemsInDB = await getMediaFromDB();
  const mediaItem = mediaItemsInDB.find((m) => m.id === mediaId);

  if (mediaItem.type === 'video') {
    await deleteMediaInDB(mediaItem.posterId);
  }
  await deleteMediaInDB(mediaId);
};

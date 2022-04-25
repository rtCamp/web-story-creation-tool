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

/* eslint-disable no-shadow -- scope chaining */
/**
 * Internal dependencies
 */
import {
  DB_NAME,
  DB_VERSION,
  ASSET_OBJECT_KEY,
  ASSET_OBJECT_STORE_NAME,
} from '../consts';
/**
 * instantiates Indexed DB and add an empty array for assets.
 *
 * @return { void } Foo.
 */
export const initDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = () => {
      resolve();
    };
    request.onupgradeneeded = (event) => {
      const storage = event.target.result.createObjectStore(
        ASSET_OBJECT_STORE_NAME,
        {
          autoIncrement: true,
        }
      );
      storage.add([], ASSET_OBJECT_KEY);
    };
  });

/**
 * get media list from indexedDB
 *
 * @return {Promise<[mediaItem]>} A promise which will resolve into an array of media stored in indexedDB
 */
export const getFromDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const request = db
        .transaction([ASSET_OBJECT_STORE_NAME])
        .objectStore(ASSET_OBJECT_STORE_NAME)
        .get(ASSET_OBJECT_KEY);
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    };
  });

/**
 * Update media item.
 *
 * @param {number }mediaId Id of media item which needs to be updated.
 * @param {string} data New data for media ( Currently supports only `altText` and `baseColor` )
 * @return {Promise<[mediaItem]>} A promise which will resolve after updating media Item in indexedDB
 */
export const updateInDB = (mediaId, data) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([ASSET_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(ASSET_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(ASSET_OBJECT_KEY);

      getRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
      getRequest.onsuccess = (event) => {
        const prevMediaList = event.target.result;

        const newMediaList = prevMediaList.map((mediaItem) => {
          if (mediaItem.id === mediaId) {
            return {
              ...mediaItem,
              baseColor: data.baseColor ? data.baseColor : mediaItem.baseColor,
              blurHash: data.blurHash ? data.blurHash : mediaItem.blurHash,
              isMuted: data.isMuted ? data.isMuted : mediaItem.isMuted,
              mediaSource: data.mediaSource
                ? data.mediaSource
                : mediaItem.mediaSource,
              optimizedId: data.optimizedId
                ? data.optimizedId
                : mediaItem.optimizedId,
              mutedId: data.mutedId ? data.mutedId : mediaItem.mutedId,
              posterId: data.posterId ? data.posterId : mediaItem.posterId,
              storyId: data.storyId ? data.storyId : mediaItem.storyId,
              alt: data.altText ? data.altText : mediaItem.alt,
            };
          } else {
            return mediaItem;
          }
        });
        const requestUpdate = objectStore.put(newMediaList, ASSET_OBJECT_KEY);
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = () => {
          resolve();
        };
      };
    };
  });

/**
 * Replace the whole media list.
 *
 * @param {Array} replacementMediaList New media list.
 * @return {Promise<[mediaItem]>} A promise which will resolve after updating media list in indexedDB
 */
export const replaceInDB = (replacementMediaList) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([ASSET_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(ASSET_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(ASSET_OBJECT_KEY);

      getRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
      getRequest.onsuccess = () => {
        const requestUpdate = objectStore.put(
          replacementMediaList,
          ASSET_OBJECT_KEY
        );
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = () => {
          resolve();
        };
      };
    };
  });

/**
 * Delete a media item in indexedDB
 *
 * @param {number} mediaId Id of the media element which needs to be deleted.
 * @return {Promise<[mediaItem]>} A promise which will resolve after deleting media item in indexedDB
 */
export const deleteInDB = (mediaId) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([ASSET_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(ASSET_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(ASSET_OBJECT_KEY);

      getRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
      getRequest.onsuccess = (event) => {
        const prevMediaList = event.target.result;

        const newMediaList = prevMediaList.filter(
          (mediaItem) => mediaId !== mediaItem.id
        );
        const requestUpdate = objectStore.put(newMediaList, ASSET_OBJECT_KEY);
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = () => {
          resolve();
        };
      };
    };
  });

/**
 * Add a media item in indexedDB
 *
 * @param {Object} mediaItem Media Item which needs to be added in indexedDB.
 * @return {Promise<[mediaItem]>} A promise which will resolve after adding media item in indexedDB
 */
export const addToDB = (mediaItem) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([ASSET_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(ASSET_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(ASSET_OBJECT_KEY);

      getRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
      getRequest.onsuccess = (event) => {
        const prevMediaList = event.target.result;

        const requestUpdate = objectStore.put(
          [...prevMediaList, mediaItem],
          ASSET_OBJECT_KEY
        );
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = () => {
          resolve();
        };
      };
    };
  });

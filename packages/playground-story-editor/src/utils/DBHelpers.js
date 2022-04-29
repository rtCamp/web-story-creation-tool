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
 * Internal dependencies
 */
import {
  DB_NAME,
  DB_VERSION,
  ASSET_OBJECT_KEY,
  ASSET_OBJECT_STORE_NAME,
  STORY_OBJECT_STORE_NAME,
} from '../consts';

/**
 * Instantiates Indexed DB ,adds asset and story stoe and add an empty array for assets.
 *
 * @return {void} void
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
      event.target.result.createObjectStore(STORY_OBJECT_STORE_NAME, {
        keyPath: 'storyId',
      });
    };
  });

/**
 * get media list from indexedDB
 *
 * @return {Promise<[mediaItem]>} A promise which will resolve into an array of media stored in indexedDB
 */
export const getMediaFromDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const getRequest = db
        .transaction([ASSET_OBJECT_STORE_NAME])
        .objectStore(ASSET_OBJECT_STORE_NAME)
        .get(ASSET_OBJECT_KEY);
      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (getEvent) => {
        resolve(getEvent.target.result);
      };
    };
  });

/**
 * Update media item.
 *
 * @param mediaId Id of media item which needs to be updated.
 * @param data New data for media ( Currently supports only `altText` and `baseColor` )
 * @return {Promise<[mediaItem]>} A promise which will resolve after updating media Item in indexedDB
 */
export const updateMediaInDB = (mediaId, data) =>
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

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (getEvent) => {
        const prevMediaList = getEvent.target.result;

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
        requestUpdate.onerror = (updateEvent) => {
          reject(updateEvent.target.errorCode);
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
 * @param replacementMediaList New media list.
 * @return {Promise<[mediaItem]>} A promise which will resolve after updating media list in indexedDB
 */
export const replaceMediaInDB = (replacementMediaList) =>
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

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = () => {
        const requestUpdate = objectStore.put(
          replacementMediaList,
          ASSET_OBJECT_KEY
        );
        requestUpdate.onerror = (updateEvent) => {
          reject(updateEvent.target.errorCode);
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
 * @param mediaId Id of the media element which needs to be deleted.
 * @return {Promise<[mediaItem]>} A promise which will resolve after deleting media item in indexedDB
 */
export const deleteMediaInDB = (mediaId) =>
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

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (getEvent) => {
        const prevMediaList = getEvent.target.result;

        const newMediaList = prevMediaList.filter(
          (mediaItem) => mediaId !== mediaItem.id
        );
        const requestUpdate = objectStore.put(newMediaList, ASSET_OBJECT_KEY);
        requestUpdate.onerror = (updateEvent) => {
          reject(updateEvent.target.errorCode);
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
 * @param mediaItem Media Item which needs to be added in indexedDB.
 * @return {Promise<[mediaItem]>} A promise which will resolve after adding media item in indexedDB
 */
export const addMediaToDB = (mediaItem) =>
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

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (event) => {
        const prevMediaList = event.target.result;
        
        const requestUpdate = objectStore.put(
          [...prevMediaList, mediaItem],
          ASSET_OBJECT_KEY
        );
        requestUpdate.onerror = (updateEvent) => {
          reject(updateEvent.target.errorCode);
        };
        requestUpdate.onsuccess = () => {
          resolve();
        };
      };
    };
  });

/**
 * Add a new Story
 *
 * @param storyObj
 * @return {Promise}
 */
export const addStoryToDB = (storyObj) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(
        [STORY_OBJECT_STORE_NAME],
        'readwrite'
      );

      transaction.onerror = (transactionEvent) => {
        reject(transactionEvent.target.errorCode);
      };
      transaction.oncomplete = () => {
        resolve();
      };

      const objectStore = transaction.objectStore('stories');

      const addRequest = objectStore.add(storyObj);

      addRequest.onerror = (addEvent) => {
        reject(addEvent.target.errorCode);
      };
    };
  });

/**
 * Delete a Story
 *
 * @param storyObj
 * @param storyId
 * @return {Promise}
 */
export const deleteStoryInDB = (storyId) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(
        [STORY_OBJECT_STORE_NAME],
        'readwrite'
      );

      transaction.onerror = (transactionEvent) => {
        reject(transactionEvent.target.errorCode);
      };
      transaction.oncomplete = () => {
        resolve();
      };

      const objectStore = transaction.objectStore('stories');

      const delRequest = objectStore.delete(storyId);

      delRequest.onerror = () => {
        reject(event.target.errorCode);
      };
    };
  });

/**
 * Update a Story
 *
 * @param storyObj
 * @return {Promise}
 */
export const updateStoryInDB = (storyObj) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([STORY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(STORY_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(storyObj.storyId);

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = () => {
        const requestUpdate = objectStore.put(storyObj);
        requestUpdate.onerror = (updateEvent) => {
          reject(updateEvent.target.errorCode);
        };
        requestUpdate.onsuccess = () => {
          resolve();
        };
      };
    };
  });

/**
 * Get a Story
 *
 * @param storyObj
 * @param storyId
 * @return {Promise}
 */
export const getStoryInDB = (storyId) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([STORY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(STORY_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(storyId);

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (getEvent) => {
        resolve(getEvent.target.result);
      };
    };
  });

/**
 * Get Ids of all stories in DB
 *
 * @param storyObj
 * @return {Promise}
 */
export const getStoryIdsInDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([STORY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(STORY_OBJECT_STORE_NAME);

      const getRequest = objectStore.getAllKeys();

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (getEvent) => {
        resolve(getEvent.target.result);
      };
    };
  });

/**
 * Get all stories in DB
 *
 * @param storyObj
 * @return {Promise}
 */
export const getStoriesInDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction([STORY_OBJECT_STORE_NAME], 'readwrite')
        .objectStore(STORY_OBJECT_STORE_NAME);

      const getRequest = objectStore.getAll();

      getRequest.onerror = (getEvent) => {
        reject(getEvent.target.errorCode);
      };
      getRequest.onsuccess = (getEvent) => {
        resolve(getEvent.target.result);
      };
    };
  });

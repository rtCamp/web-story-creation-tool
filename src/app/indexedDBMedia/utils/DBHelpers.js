import {
  DB_NAME,
  DB_VERSION,
  ASSET_OBJECT_KEY,
  ASSET_OBJECT_STORE_NAME,
} from "./consts";

/**
 * instantiates Indexed DB and add an empty array for assets.
 */
export const initDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
    request.onsuccess = (event) => {
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
 * @returns {Promise<[mediaItem]>} A promise which will resolve into an array of media stored in indexedDB
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
 * @param mediaId Id of media item which needs to be updated.
 * @param data New data for media ( Currently supports only `altText` and `baseColor` )
 * @returns {Promise<[mediaItem]>} A promise which will resolve after updating media Item in indexedDB
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
        .transaction([ASSET_OBJECT_STORE_NAME], "readwrite")
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
              posterId: data.posterId ? data.posterId : mediaItem.posterId,
            };
          } else {
            return mediaItem;
          }
        });
        const requestUpdate = objectStore.put(newMediaList, ASSET_OBJECT_KEY);
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    };
  });

/**
 * Replace the whole media list.
 * @param replacementMediaList New media list.
 * @returns {Promise<[mediaItem]>} A promise which will resolve after updating media list in indexedDB
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
        .transaction([ASSET_OBJECT_STORE_NAME], "readwrite")
        .objectStore(ASSET_OBJECT_STORE_NAME);

      const getRequest = objectStore.get(ASSET_OBJECT_KEY);

      getRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
      getRequest.onsuccess = (event) => {
        const requestUpdate = objectStore.put(
          replacementMediaList,
          ASSET_OBJECT_KEY
        );
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    };
  });

/**
 * Delete a media item in indexedDB
 * @param mediaId Id of the media element which needs to be deleted.
 * @returns {Promise<[mediaItem]>} A promise which will resolve after deleting media item in indexedDB
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
        .transaction([ASSET_OBJECT_STORE_NAME], "readwrite")
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
        console.log(newMediaList);
        const requestUpdate = objectStore.put(newMediaList, ASSET_OBJECT_KEY);
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    };
  });

/**
 * Add a media item in indexedDB
 * @param mediaItem Media Item which needs to be added in indexedDB.
 * @returns {Promise<[mediaItem]>} A promise which will resolve after adding media item in indexedDB
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
        .transaction([ASSET_OBJECT_STORE_NAME], "readwrite")
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
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    };
  });

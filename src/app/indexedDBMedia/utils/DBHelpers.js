import {
  DB_NAME,
  DB_VERSION,
  ASSET_OBJECT_KEY,
  ASSET_OBJECT_STORE_NAME,
} from "./consts";

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
              alt: data.altText ? data.altText : mediaItem.alt,
              baseColor: data.baseColor ? data.baseColor : mediaItem.baseColor,
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

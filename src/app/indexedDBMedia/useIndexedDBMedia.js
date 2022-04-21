import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import getResourceFromLocalFile from "./utils/getResourceFromLocalFile";

const useIndexedDBMedia = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const dbRef = useRef(null);

  const _initIndexedDB = () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open("MyTestDatabase");
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        dbRef.current = event.target.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const storage = event.target.result.createObjectStore("assets", {
          autoIncrement: true,
        });
        storage.add([], "files");
      };
    });

  const _addToDB = (media) =>
    new Promise((resolve, reject) => {
      const objectStore = dbRef.current
        .transaction(["assets"], "readwrite")
        .objectStore("assets");

      const request = objectStore.get("files");

      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        const data = event.target.result;

        const requestUpdate = objectStore.put([...data, media], "files");
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    });

  const _refreshMedia = () =>
    new Promise((resolve, reject) => {
      let objectStore = dbRef.current
        .transaction(["assets"], "readwrite")
        .objectStore("assets");

      let request = objectStore.get("files");

      request.onerror = (event) => {
        reject(event.target.errorCode);
      };

      request.onsuccess = async (event) => {
        const data = event.target.result;
        const newData = [];
        const dataRefreshPromises = data.map(
          (mediaItem) =>
            new Promise(async (resolve, reject) => {
              const { resource: mediaData } = await getResourceFromLocalFile(
                mediaItem.file
              );
              const updatedResource = {
                ...mediaItem,
                src: mediaData.src,
                local: false, // this disables the UploadingIndicator
              };
              if ("video" === mediaItem?.type) {
                updatedResource.poster = mediaData.poster;
              }
              newData.push(updatedResource);
              resolve();
            })
        );

        await Promise.all(dataRefreshPromises);

        objectStore = dbRef.current
          .transaction(["assets"], "readwrite")
          .objectStore("assets");

        request = objectStore.get("files");

        const requestUpdate = objectStore.put(newData, "files");

        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    });

  const getMedia = ({ mediaType, searchTerm }) =>
    new Promise((resolve, reject) => {
      const request = dbRef.current
        .transaction(["assets"])
        .objectStore("assets")
        .get("files");
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        let filteredMedia = event.target.result;
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
        resolve({
          data: filteredMedia,
          headers: {
            totalItems: filteredMedia.length,
            totalPages: 1,
          },
        });
      };
    });

  const uploadMedia = (file) =>
    new Promise(async (resolve, reject) => {
      const { resource: mediaData } = await getResourceFromLocalFile(file);
      mediaData.local = false; // this disables the UploadingIndicator
      mediaData.id = uuidv4();
      mediaData.file = file;
      mediaData.modifiedAt = new Date().getTime();
      await _addToDB(mediaData);
      resolve();
    });

  const updateMedia = (mediaId, data) =>
    new Promise((resolve, reject) => {
      const objectStore = dbRef.current
        .transaction(["assets"], "readwrite")
        .objectStore("assets");

      const request = objectStore.get("files");

      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        const mediaInDB = event.target.result;

        const newMedia = mediaInDB.map((mediaItem) => {
          if (mediaId !== mediaItem.id) {
            return mediaItem;
          } else {
            mediaItem.alt = data.altText ? data.altText : mediaItem.alt;
            mediaItem.baseColor = data.baseColor
              ? data.baseColor
              : mediaItem.baseColor;
            mediaItem.creationDate = new Date().toISOString();

            return mediaItem;
          }
        });

        const requestUpdate = objectStore.put(newMedia, "files");
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    });

  const deleteMedia = (mediaId) =>
    new Promise((resolve, reject) => {
      const objectStore = dbRef.current
        .transaction(["assets"], "readwrite")
        .objectStore("assets");

      const request = objectStore.get("files");

      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        const mediaInDB = event.target.result;
        const newMedia = mediaInDB.filter(
          (mediaItem) => mediaId !== mediaItem.id
        );
        console.log(newMedia);

        const requestUpdate = objectStore.put(newMedia, "files");
        requestUpdate.onerror = (event) => {
          reject(event.target.errorCode);
        };
        requestUpdate.onsuccess = (event) => {
          resolve();
        };
      };
    });

  const _onMountRoutine = async () => {
    await _initIndexedDB();
    await _refreshMedia();
    setIsInitialized(true);
  };

  useEffect(() => {
    _onMountRoutine();
  }, []);

  return {
    dbRef,
    isInitialized,
    getMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    isIndexedDBSupported: window.indexedDB,
  };
};

export default useIndexedDBMedia;

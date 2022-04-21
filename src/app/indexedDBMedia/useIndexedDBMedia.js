import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addToDB,
  deleteInDB,
  getFromDB,
  initDB,
  replaceInDB,
  updateInDB,
} from "./utils/DBHelpers";
import getResourceFromLocalFile from "./utils/getResourceFromLocalFile";

const useIndexedDBMedia = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const _refreshMedia = async () => {
    const mediaInDB = await getFromDB();

    const newData = [];
    const dataRefreshPromises = mediaInDB.map(
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
    await replaceInDB(newData);
  };

  const getMedia = async ({ mediaType, searchTerm }) => {
    let filteredMedia = await getFromDB();

    // remove poster

    filteredMedia = filteredMedia.filter(
      (mediaItem) => mediaItem.mediaSource !== "poster-generation"
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

  const uploadMedia = async (file, additionalData) => {
    let { resource: mediaData } = await getResourceFromLocalFile(file);
    console.log("upload", { file, additionalData });
    mediaData = {
      ...mediaData,
      local: false, // this disables the UploadingIndicator
      id: uuidv4(),
      file,
      modifiedAt: new Date().getTime(),
      ...additionalData,
      alt: additionalData?.altText ? additionalData.altText : mediaData.alt,
    };

    if (additionalData?.mediaSource === "poster-generation") {
      // if a Poster is being uploaded update respective video asset
      const videoMediaId = additionalData.mediaId;
      await updateInDB(videoMediaId, {
        posterId: mediaData.id,
        modifiedAt: new Date().getTime(),
      });
    }
    await addToDB(mediaData);
  };

  const updateMedia = async (mediaId, data) => {
    console.log("update", data);
    await updateInDB(mediaId, data);
  };

  const deleteMedia = async (mediaId) => {
    await deleteInDB(mediaId);
  };

  const _onMountRoutine = async () => {
    await initDB();
    await _refreshMedia();
    setIsInitialized(true);
  };

  useEffect(() => {
    _onMountRoutine();
  }, []);

  return {
    isInitialized,
    getMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    isIndexedDBSupported: window.indexedDB,
  };
};

export default useIndexedDBMedia;

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

  const _refreshMedia = () =>
    new Promise(async (resolve, reject) => {
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
      resolve();
    });

  const getMedia = ({ mediaType, searchTerm }) =>
    new Promise(async (resolve, reject) => {
      let filteredMedia = await getFromDB();
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
    });

  const uploadMedia = (file) =>
    new Promise(async (resolve, reject) => {
      const { resource: mediaData } = await getResourceFromLocalFile(file);
      mediaData.local = false; // this disables the UploadingIndicator
      mediaData.id = uuidv4();
      mediaData.file = file;
      mediaData.modifiedAt = new Date().getTime();
      await addToDB(mediaData);
      resolve();
    });

  const updateMedia = (mediaId, data) =>
    new Promise(async (resolve, reject) => {
      await updateInDB(mediaId, data);
      resolve();
    });

  const deleteMedia = (mediaId) =>
    new Promise(async (resolve, reject) => {
      await deleteInDB(mediaId);
      resolve();
    });

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

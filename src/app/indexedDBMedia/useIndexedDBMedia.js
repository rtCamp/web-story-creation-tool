import { useEffect, useState } from "react";
import { getFromDB, initDB, replaceInDB } from "../../utils";
import { getResourceFromLocalFile } from "../../utils";

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
    isIndexedDBSupported: window.indexedDB,
  };
};

export default useIndexedDBMedia;

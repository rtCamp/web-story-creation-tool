/**
 * External dependencies
 */

import { useEffect } from "react";
/**
 * Internal dependencies
 */
import { getMediaFromDB, initDB, replaceMediaInDB } from "../../utils";
import { getResourceFromLocalFile } from "../../utils";
import { useStoryStatus } from "../storyStatus";

const useIndexedDBMedia = () => {
  const { updateIsInitializingIndexDB, updateIsRefreshingMedia } =
    useStoryStatus(({ actions }) => ({
      updateIsInitializingIndexDB: actions.updateIsInitializingIndexDB,
      updateIsRefreshingMedia: actions.updateIsRefreshingMedia,
    }));

  const _refreshMedia = async () => {
    const mediaInDB = await getMediaFromDB();
    const newData = [];

    await Promise.all(
      mediaInDB.map(async (mediaItem) => {
        if (mediaItem.mediaSource === "poster-generation") {
          return;
        }

        const { resource: mediaData } = await getResourceFromLocalFile(
          mediaItem.file
        );
        const updatedMediaItem = {
          ...mediaItem,
          src: mediaData.src,
          local: false, // this disables the UploadingIndicator
        };
        if ("video" === mediaItem?.type) {
          const posterItem = mediaInDB.find(
            (m) => m.id === mediaItem.posterId
          );
          posterItem.src = mediaData.poster;
          updatedMediaItem.poster = mediaData.poster;

          newData.push(posterItem);
        }
        newData.push(updatedMediaItem);
      })
    );
    await replaceMediaInDB(newData);
  };

  const _onMountRoutine = async () => {
    updateIsInitializingIndexDB(true);
    await initDB();
    updateIsInitializingIndexDB(false);

    updateIsRefreshingMedia(true);
    await _refreshMedia();
    updateIsRefreshingMedia(false);
  };

  useEffect(() => {
    _onMountRoutine();
  }, []);

  return {
    isIndexedDBSupported: window.indexedDB,
  };
};

export default useIndexedDBMedia;

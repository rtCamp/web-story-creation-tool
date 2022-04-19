/**
 * External dependencies
 */
import React from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useState, useCallback } from "@googleforcreators/react";
import { getFileName } from "@googleforcreators/media";

/**
 * Internal dependencies
 */
import MediaContext from "./context";
import { getResourceFromLocalFile, isValidFile } from "./utils";

function MediaProvider({ children }) {
  const [media, updateMedia] = useState([]);
  const [isInitialMount, updateIsInitialMount] = useState(true);

  const addLocalFiles = useCallback(
    async (files) => {
      const mediaItems = [];

      await Promise.all(
        [...files].map(async (file) => {
          try {
            isValidFile(file); // this will throw an error.
            const mediaTitles = media.map((mediaItem) => mediaItem.title);
            if (mediaTitles.includes(getFileName(file))) {
              return;
            }
            const { resource: mediaData } = await getResourceFromLocalFile(
              file
            );
            mediaData.local = false; // this disables the UploadingIndicator
            mediaData.id = uuidv4();
            mediaData.file = file;
            mediaData.modifiedAt = new Date().getTime();
            mediaItems.push(mediaData);
          } catch (e) {
            //TODO:Add snackbar or alert
          }
        })
      );
      updateMedia((prevMedia) => {
        const prevMediaTitles = prevMedia.map((mediaItem) => mediaItem.alt);
        const filteredMedia = mediaItems.filter(
          (mediaItem) => !prevMediaTitles.includes(mediaItem.alt)
        );
        return [...prevMedia, ...filteredMedia];
      });
    },
    [updateMedia, media]
  );

  const restoreMediaFromDb = useCallback(
    async (mediaListInDb) => {
      const mediaItems = [];

      await Promise.all(
        mediaListInDb.map(async (mediaItemInDb) => {
          try {
            const { resource: mediaData } = await getResourceFromLocalFile(
              mediaItemInDb.file
            );
            const updatedResource = {
              ...mediaItemInDb,
              src: mediaData.src,
              local: false, // this disables the UploadingIndicator
            };

            if ("video" === mediaItemInDb?.type) {
              updatedResource.poster = mediaData.poster;
            }
            mediaItems.push(updatedResource);
          } catch (e) {
            //TODO:Add snackbar or alert
          }
        })
      );
      updateMedia((prevMedia) => {
        const prevMediaTitles = prevMedia.map((mediaItem) => mediaItem.title);
        const filteredMedia = mediaItems.filter(
          (mediaItem) => !prevMediaTitles.includes(mediaItem.title)
        );
        return [...prevMedia, ...filteredMedia];
      });
    },
    [updateMedia]
  );

  const getMedia = useCallback(
    ({ mediaType, searchTerm }) => {
      let filteredMedia = media;
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

      return Promise.resolve({
        data: filteredMedia,
        headers: {
          totalItems: filteredMedia.length,
          totalPages: 1,
        },
      });
    },
    [media]
  );

  const deleteMedia = useCallback(
    (mediaId) => {
      const filteredMedia = media.filter(
        (mediaItem) => mediaItem.id !== mediaId
      );
      updateMedia(filteredMedia);
    },
    [media]
  );

  const uploadMediaCallback = async (file) => {
    if (Object.prototype.toString.call(file).includes("Blob")) {
      return;
    }
    await addLocalFiles([file]);
  };

  const updateMediaCallback = useCallback((mediaId, data) => {
    updateMedia((prevMedia) => {
      const updated = prevMedia.map((mediaItem) => {
        if (mediaId !== mediaItem.id) {
          return mediaItem;
        } else {
          mediaItem.alt = data.alt_text ? data.alt_text : mediaItem.alt;
          mediaItem.creationDate = new Date().toISOString();

          return mediaItem;
        }
      });
      return updated;
    });
  }, []);

  const value = {
    actions: {
      getMediaCallback: getMedia,
      updateMediaCallback,
      uploadMediaCallback,
      deleteMedia,
      updateIsInitialMount,
      addLocalFiles,
      restoreMediaFromDb,
      updateMedia,
    },

    state: {
      media,
      isInitialMount,
    },
  };
  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
}

MediaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MediaProvider;

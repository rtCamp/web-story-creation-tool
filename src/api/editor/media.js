/**
 * External dependencies
 */
import { v4 as uuidv4 } from "uuid";

/**
 * Internal dependencies
 */
import { getFromDB, updateInDB, deleteInDB, addToDB } from "../../utils";
import { getResourceFromLocalFile } from "../../utils";

export const getMedia = async ({ mediaType, searchTerm }) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

export const uploadMedia = async (file, additionalData) => {
  let { resource: mediaData } = await getResourceFromLocalFile(file);
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

export const updateMedia = async (mediaId, data) => {
  try {
    await updateInDB(mediaId, data);
  } catch (error) {
    throw error;
  }
};

export const deleteMedia = async (mediaId) => {
  try {
    const mediaItemsInDB = await getFromDB();
    const mediaItem = mediaItemsInDB.find((m) => m.id === mediaId);

    if (mediaItem.type === "video") {
      await deleteInDB(mediaItem.posterId);
    }
    await deleteInDB(mediaId);
  } catch (error) {
    throw error;
  }
};

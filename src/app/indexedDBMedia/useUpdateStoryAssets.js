import { useStory } from "@googleforcreators/story-editor";
import { useEffect, useRef } from "react";

const useUpdateStoryAssets = () => {
  const updatedOnce = useRef(false);

  const { updateElementsByResourceId, pages } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
    pages: state.state.pages,
  }));

  const _getMediaInDB = () =>
    new Promise((resolve, reject) => {
      var request = indexedDB.open("MyTestDatabase");
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        const request = db
          .transaction(["assets"])
          .objectStore("assets")
          .get("files");
        request.onerror = (event) => {
          reject(event.target.errorCode);
        };
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      };
    });

  const _updateStoryAssets = async () => {
    const elementsList = [];
    pages.forEach((page) => {
      page.elements.forEach((element) => {
        elementsList.push(element);
      });
    });

    const mediaListInDb = await _getMediaInDB();

    mediaListInDb.forEach((mediaItemInDb) => {
      elementsList.forEach(async (element) => {
        if (
          ["image", "video"].includes(element?.type) &&
          element.resource.id === mediaItemInDb.id
        ) {
          const resourceId = element.resource.id;
          const mediaResource = {
            id: resourceId,
            properties: ({ resource, ...rest }) => {
              const updatedResource = {
                ...mediaItemInDb,
                id: resourceId,
              };

              if ("video" === element?.type) {
                updatedResource.poster = mediaData.poster;
              }
              return {
                ...rest,
                resource: updatedResource,
              };
            },
          };
          updateElementsByResourceId(mediaResource);
        }
      });
    });
  };

  useEffect(() => {
    if (pages.length > 0 && !updatedOnce.current) {
      _updateStoryAssets();
      updatedOnce.current = true;
    }
  }, [pages]);

  return null;
};

export default useUpdateStoryAssets;

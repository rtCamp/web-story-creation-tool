import { useStory } from "@googleforcreators/story-editor";
import { useEffect, useRef } from "react";
import { getFromDB } from "../../utils";

const useUpdateStoryAssets = () => {
  const updatedOnce = useRef(false);

  const { updateElementsByResourceId, pages } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
    pages: state.state.pages,
  }));

  const _updateStoryAssets = async () => {
    const elementsList = [];
    pages.forEach((page) => {
      page.elements.forEach((element) => {
        elementsList.push(element);
      });
    });

    const mediaListInDb = await getFromDB();

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
                updatedResource.poster = mediaListInDb.poster;
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

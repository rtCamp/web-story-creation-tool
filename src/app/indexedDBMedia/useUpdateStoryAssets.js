/**
 * External dependencies
 */
import { useStory } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import { useEffect, useRef } from "react";
import { getMediaFromDB } from "../../utils";
import { useStoryStatus } from "../storyStatus";

const useUpdateStoryAssets = () => {
  const updatedOnce = useRef(false);
  const { updateIsUpdatingStoryAssets } = useStoryStatus(({ actions }) => ({
    updateIsUpdatingStoryAssets: actions.updateIsUpdatingStoryAssets,
  }));

  const { updateElementsByResourceId, pages } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
    pages: state.state.pages,
  }));

  const _updateStoryAssets = async () => {
    updateIsUpdatingStoryAssets(true);
    const elementsList = [];
    pages.forEach((page) => {
      page.elements.forEach((element) => {
        elementsList.push(element);
      });
    });

    const mediaListInDb = await getMediaFromDB();

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
    updateIsUpdatingStoryAssets(false);
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

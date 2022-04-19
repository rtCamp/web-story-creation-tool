/**
 * External dependencies
 */
import { useCallback, useEffect } from '@googleforcreators/react';
import { useStory } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import useMedia from '../useMedia';
import getResourceFromLocalFile from './getResourceFromLocalFile';
import { initIndexDb } from './initIndexDb';

// After usePersistedassets pulls files from indexDB into media provider, they will have new blob URLs.
// Old source URLs in elements using 1P media and 1p media library pane needs to be updated updated.

function usePersistentAssets() {
  const {
    state: { media, isInitialMount: isUpdated },
    actions: { restoreMediaFromDb, updateIsInitialMount: updateIsUpdated },
  } = useMedia(({ state, actions }) => ({
    state,
    actions,
  }));

  const { updateElementsByResourceId, pages } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
    pages: state.state.pages,
  }));

  const updateResourcesFromStoredFiles = useCallback(
    (mediaListInDb) => {
      const elementsList = [];
      pages.forEach((page) => {
        page.elements.forEach((element) => {
          elementsList.push(element);
        });
      });

      mediaListInDb.forEach((mediaItemInDb) => {
        elementsList.forEach(async (element) => {
          if (
            ['image', 'video'].includes(element?.type) &&
            element.resource.id === mediaItemInDb.id
          ) {
            const { resource: mediaData } = await getResourceFromLocalFile(
              mediaItemInDb.file
            );
            const resourceId = element.resource.id;
            const mediaResource = {
              id: resourceId,
              properties: ({ resource, ...rest }) => {
                const updatedResource = {
                  ...mediaItemInDb,
                  id: resourceId,
                  src: mediaData.src,
                };

                if ('video' === element?.type) {
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
    },
    [updateElementsByResourceId, pages]
  );

  /**
   * Effect runs every time a 1P media is uploaded
   * Watch media state and store media files to index db.
   */
  useEffect(() => {
    if (isUpdated) {
      return;
    }

    // This is to avoid storing it twice during import.
    const shouldSaveToIndexDb = media.every(({ file }) => Boolean(file));

    if (shouldSaveToIndexDb) {
      initIndexDb(media, 'save');
    }

    updateIsUpdated(false);
  }, [media, isUpdated, updateIsUpdated, pages]);

  /**
   * Restore media and component mount.
   */
  useEffect(() => {
    if (isUpdated && pages.length > 0) {
      initIndexDb(null, 'get', async (mediaListInDb) => {
        await restoreMediaFromDb(mediaListInDb);
        updateResourcesFromStoredFiles(mediaListInDb);
      });

      updateIsUpdated(false);
    }
  }, [
    restoreMediaFromDb,
    updateResourcesFromStoredFiles,
    isUpdated,
    updateIsUpdated,
    pages,
  ]);
}

export default usePersistentAssets;

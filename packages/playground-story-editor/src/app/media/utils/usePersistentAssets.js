/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import { useCallback, useEffect } from '@web-stories-wp/react';
import { useStory } from '@web-stories-wp/story-editor';

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
    actions: { addLocalFiles, updateIsInitialMount: updateIsUpdated },
  } = useMedia(({ state, actions }) => ({
    state,
    actions,
  }));

  const { updateElementsByResourceId, pages } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
    pages: state.state.pages,
  }));

  const updateResourcesFromStoredFiles = useCallback(
    (files) => {
      console.log('pages', pages);
      const elementsList = [];
      pages.forEach((page) => {
        page.elements.forEach((element) => {
          elementsList.push(element);
        });
      });

      files.forEach((fileItem) => {
        elementsList.forEach(async (element) => {
          if (
            ['image', 'video'].includes(element?.type) &&
            element.resource.title === fileItem.title
          ) {
            const { resource: mediaData } = await getResourceFromLocalFile(
              fileItem.file
            );
            const resourceId = element.resource.id;
            const mediaResource = {
              id: resourceId,
              properties: ({ resource, ...rest }) => ({
                ...rest,
                resource: { ...mediaData, id: resourceId },
              }),
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
    const mediaItemsToSave = media.map(({ file, title }) => ({
      file,
      title,
    }));

    if (shouldSaveToIndexDb) {
      initIndexDb(mediaItemsToSave, 'save');
    }

    updateIsUpdated(false);
  }, [media, isUpdated, updateIsUpdated, pages]);

  /**
   * Restore media and component mount.
   */
  useEffect(() => {
    console.log(isUpdated, pages.length);
    if (isUpdated && pages.length > 0) {
      initIndexDb(null, 'get', async (files) => {
        const fileItems = files.map((item) => item.file);
        await addLocalFiles(fileItems);

        updateResourcesFromStoredFiles(files);
      });

      updateIsUpdated(false);
    }
  }, [
    addLocalFiles,
    updateResourcesFromStoredFiles,
    isUpdated,
    updateIsUpdated,
    pages,
  ]);
}

export default usePersistentAssets;

/*
 * Copyright 2022 Google LLC
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
import { renderToStaticMarkup } from '@googleforcreators/react';
import { PAGE_RATIO, PAGE_WIDTH } from '@googleforcreators/units';
import { DATA_VERSION } from '@googleforcreators/migration';
import { OutputStory } from '@googleforcreators/output';
/**
 * Internal dependencies
 */
import { isBlobURL } from '../../../../utils';
import { COMMON_MIME_TYPE_MAPPING } from '../../../../consts';
function blobToBase64(blob) {
  // eslint-disable-next-line no-unused-vars -- impossible chance to reject this promise
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
async function getUpdatedData({ pages, story, current, selection }) {
  const mediaTypes = ['image', 'video'];
  const updatedPages = await Promise.all(
    pages.map(async (page) => {
      const currentPage = page ? JSON.parse(JSON.stringify(page)) : {};
      await Promise.all(
        currentPage.elements.map(async (element) => {
          const mediaType = element.type;

          if (!mediaTypes.includes(mediaType)) {
            return;
          }
          const { src, mimeType, poster, alt } = element.resource;
          const extension = COMMON_MIME_TYPE_MAPPING[mimeType];

          if (!extension) {
            return;
          }

          /**
           * Use double size image of the page ratio as unsplash image size can be very
           * large and we aren't using srcset to keep things simple for the user.
           */
          if (src.startsWith('https://images.unsplash.com')) {
            const resizedSrc = new URL(src);
            resizedSrc.searchParams.set(
              'w',
              encodeURIComponent(PAGE_WIDTH * 2)
            );
            resizedSrc.searchParams.set(
              'h',
              encodeURIComponent((PAGE_WIDTH * 2) / PAGE_RATIO)
            );
            return;
          }

          if (!isBlobURL(src)) {
            return;
          }

          const resp = await fetch(src);
          const respBlob = await resp.blob();
          let posterFileName;
          if (poster) {
            posterFileName = `${alt}-poster.jpeg`;
          }

          element.resource.src = await blobToBase64(respBlob);

          if (posterFileName) {
            element.resource.poster = posterFileName;
          }
        })
      );
      return currentPage;
    })
  );

  const storyData = {
    current,
    selection,
    story: {
      globalStoryStyles: story?.globalStoryStyles,
      adOptions: story?.adOptions,
      title: story?.title,
    },
    version: DATA_VERSION,
    pages: updatedPages,
  };

  const markup = renderToStaticMarkup(
    <OutputStory
      story={storyData.story}
      pages={storyData.pages}
      metadata={{ publisher: '' }}
      flags={{ allowBlobs: true }}
    />
  );
  return markup;
}
export default getUpdatedData;

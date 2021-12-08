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
import { Tooltip, useStory } from '@web-stories-wp/story-editor';
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { escapeHTML } from '../../../utils';

const PREVIEW_TARGET = 'story-preview';

function PreviewButton() {
  const { isSaving, saveStory, previewLink } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { previewLink },
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      saveStory,
      previewLink,
    })
  );

  /**
   * Applies any local transforms (e.g. AMP development mode) to the stored preview link.
   *
   * @param {string} urlString The original preview link.
   * @return {string} The decorated preview link.
   */
  const decoratePreviewLink = (urlString) => {
    const url = new URL(urlString);
    // #development=1 triggers amp-story's multi-aspect preview mode.
    url.hash = '#development=1';
    return url.toString();
  };
  const openPreviewLink = async () => {
    await saveStory();

    let popup;
    try {
      popup = global.open('about:blank', PREVIEW_TARGET);
      if (popup) {
        popup.document.write('<!DOCTYPE html><html><head>');
        popup.document.write('<title>');
        popup.document.write(
          escapeHTML(__('Generating the preview…', 'web-stories'))
        );
        popup.document.write('</title>');
        popup.document.write('</head><body>');
        // Output "waiting" message.
        popup.document.write(
          escapeHTML(__('Please wait. Generating the preview…', 'web-stories'))
        );

        const decoratedPreviewLink = decoratePreviewLink(previewLink);
        // Force redirect to the preview URL after 5 seconds. The saving tab
        // might get frozen by the browser.
        popup.document.write(
          `<script>
            setTimeout(function() {
              location.replace(${JSON.stringify(decoratedPreviewLink)});
            }, 5000);
          </script>`
        );
      }
    } catch (e) {
      // Ignore errors. Anything can happen with a popup. The errors
      // will be resolved after the story is saved.
    }
  };

  return (
    <Tooltip title={'Preview'} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        onClick={openPreviewLink}
        disabled={isSaving}
      >
        <Icons.Eye />
      </Button>
    </Tooltip>
  );
}

export { PreviewButton };

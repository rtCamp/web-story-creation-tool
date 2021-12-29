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
import { useCallback } from '@web-stories-wp/react';
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

function getPreviewLink() {
  return (
    location.protocol +
    '//' +
    location.host +
    location.pathname +
    'preview.html'
  );
}

function Preview() {
  const { saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { status },
      },
      actions: { autoSave, saveStory },
    }) => ({ isSaving, status, autoSave, saveStory })
  );

  /**
   * Open a preview of the story in current window.
   */
  const openPreviewLink = useCallback(async () => {
    await saveStory();
    const playgroundPreviewLink = getPreviewLink();
    // Start a about:blank popup with waiting message until we complete
    // the saving operation. That way we will not bust the popup timeout.
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
        const decoratedPreviewLink = playgroundPreviewLink;
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

    // Save story directly if draft, otherwise, use auto-save.
  }, [saveStory]);

  const label = __('Preview', 'web-stories');
  return (
    <Tooltip title={label} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        onClick={openPreviewLink}
        aria-label={label}
      >
        <Icons.Eye />
      </Button>
    </Tooltip>
  );
}

export default Preview;

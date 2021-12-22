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
import { Tooltip } from '@web-stories-wp/story-editor';
import { useCallback, useEffect } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useStoryImport from '../../../app/storyImport/useStoryImport';
import { useStoryStatus } from '../../../app/storyStatus';

function Import() {
  const { renderGhostInput, importStory } = useStoryImport();
  const {
    state: { isImporting, isExporting },
  } = useStoryStatus(({ state }) => ({
    state,
  }));

  const onClick = useCallback(() => {
    importStory();
  }, [importStory]);

  useEffect(() => {
    renderGhostInput();
  });

  const label = __('Import', 'web-stories');
  return (
    <Tooltip title={label} hasTail>
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={onClick}
        disabled={isImporting || isExporting}
        aria-label={label}
      >
        {label}
      </Button>
    </Tooltip>
  );
}

export default Import;

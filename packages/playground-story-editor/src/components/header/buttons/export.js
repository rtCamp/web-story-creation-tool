/*
 * Copyright 2020 Google LLC
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

import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';
import { Tooltip } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import useExportStory from '../../../app/storyExport/useExportStory';
import { useStoryStatus } from '../../../app/storyStatus';

function Export() {
  const {
    state: { isExporting, isImporting },
  } = useStoryStatus(({ state }) => ({
    state,
  }));

  const { exportStory } = useExportStory();
  const label = __('Export', 'web-stories');
  return (
    <Tooltip title={label} hasTail>
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        disabled={isExporting || isImporting}
        onClick={exportStory}
      >
        {__('Export', 'web-stories')}
      </Button>
    </Tooltip>
  );
}

export default Export;

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
import { Tooltip, useStory } from '@googleforcreators/story-editor';
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useSnackbar,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStoryStatus } from '../../../app/storyStatus';

function Save() {
  const { showSnackbar } = useSnackbar();
  const { saveStory } = useStory(({ actions: { saveStory } }) => ({
    saveStory,
  }));
  const {
    state: { isImporting, isSaving },
  } = useStoryStatus(({ state }) => ({
    state,
  }));

  const onClick = useCallback(async () => {
    await saveStory();
    showSnackbar({
      message: 'Story Saved',
      dismissable: true,
    });
  }, [saveStory, showSnackbar]);

  const label = __('Save', 'web-stories');
  return (
    <Tooltip title={label} hasTail>
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        disabled={isImporting || isSaving}
        onClick={onClick}
        aria-label={label}
      >
        {label}
      </Button>
    </Tooltip>
  );
}

export default Save;

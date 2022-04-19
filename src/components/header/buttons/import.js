/**
 * External dependencies
 */
import React from 'react';
import { Tooltip } from "@googleforcreators/story-editor";
import { useCallback, useEffect } from "@googleforcreators/react";
import { __ } from "@googleforcreators/i18n";
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from "@googleforcreators/design-system";

/**
 * Internal dependencies
 */
import useStoryImport from "../../../app/storyImport/useStoryImport";
import { useStoryStatus } from "../../../app/storyStatus";

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

  const label = __("Import", "web-stories");
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

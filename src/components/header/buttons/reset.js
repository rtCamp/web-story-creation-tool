/**
 * External dependencies
 */
import React from "react";
import { __ } from "@googleforcreators/i18n";
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from "@googleforcreators/design-system";
import { useCallback } from "@googleforcreators/react";
import { useStory, Tooltip } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import { useStoryStatus } from "../../../app/storyStatus";
import getInitialStoryState from "../../../utils/getInitialStoryState";
import { LOCAL_STORAGE_CONTENT_KEY } from "../../../consts";

function Reset() {
  const {
    internal: { restore },
  } = useStory();

  const {
    state: { isImporting, isExporting },
  } = useStoryStatus(({ state }) => ({
    state,
  }));

  const resetStory = useCallback(() => {
    if (
      !window.confirm(
        __("Are you sure you want to reset all changes?", "web-stories")
      )
    ) {
      return;
    }
    window.localStorage.removeItem(LOCAL_STORAGE_CONTENT_KEY);
    restore(getInitialStoryState());
  }, [restore]);

  const label = __("Reset", "web-stories");

  return (
    <>
      <Tooltip title={label} hasTail>
        <Button
          variant={BUTTON_VARIANTS.RECTANGLE}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          disabled={isImporting || isExporting}
          onClick={resetStory}
          aria-label={label}
        >
          {label}
        </Button>
      </Tooltip>
    </>
  );
}

export default Reset;

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

/**
 * Internal dependencies
 */
import useExportStory from "../../../app/storyExport/useStoryExport";
import { useStoryStatus } from "../../../app/storyStatus";

function Export() {
  const {
    state: { isExporting, isImporting },
  } = useStoryStatus(({ state }) => ({
    state,
  }));

  const { exportStory } = useExportStory();
  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      disabled={isExporting || isImporting}
      onClick={exportStory}
    >
      {__("Export", "web-stories")}
    </Button>
  );
}

export default Export;

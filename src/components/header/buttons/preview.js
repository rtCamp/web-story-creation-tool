/**
 * External dependencies
 */
import React from "react";
import { Tooltip, useStory } from "@googleforcreators/story-editor";
import { useCallback } from "@googleforcreators/react";
import { __ } from "@googleforcreators/i18n";
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from "@googleforcreators/design-system";
/**
 * Internal dependencies
 */
import { escapeHTML } from "../../../utils";

function getPreviewLink() {
  return (
    location.protocol +
    "//" +
    location.host +
    location.pathname +
    "preview.html"
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
      popup = window.open(
        playgroundPreviewLink,
        "_blank",
        "location=yes,height=802,width=704,scrollbars=yes,status=yes"
      );
      if (popup) {
        popup.document.write("<!DOCTYPE html><html><head>");
        popup.document.write("<title>");
        popup.document.write(
          escapeHTML(__("Generating the preview…", "web-stories"))
        );
        popup.document.write("</title>");
        popup.document.write("</head><body>");
        // Output "waiting" message.
        popup.document.write(
          escapeHTML(__("Please wait. Generating the preview…", "web-stories"))
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

  const label = __("Preview", "web-stories");
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

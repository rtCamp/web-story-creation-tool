/**
 * External dependencies
 */
import React from "react";
import PropTypes from "prop-types";
import { useState } from "@googleforcreators/react";
import { useStory } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import Context from "./context";

function StoryStatusProvider({ children }) {
  const [isImporting, updateIsImporting] = useState(false);
  const [isExporting, updateIsExporting] = useState(false);
  const { isSaving } = useStory(
    ({
      state: {
        meta: { isSaving },
      },
    }) => ({ isSaving })
  );

  const value = {
    state: {
      isImporting,
      isExporting,
      isSaving,
    },
    actions: {
      updateIsImporting,
      updateIsExporting,
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

StoryStatusProvider.propTypes = {
  children: PropTypes.node,
};

export default StoryStatusProvider;

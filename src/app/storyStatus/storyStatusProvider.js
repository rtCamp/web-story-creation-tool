/**
 * External dependencies
 */
import React from "react";
import PropTypes from "prop-types";
import { useState } from "@googleforcreators/react";

/**
 * Internal dependencies
 */
import Context from "./context";

function StoryStatusProvider({ children }) {
  const [isInitializingIndexDB, updateIsInitializingIndexDB] = useState(true);
  const [isImporting, updateIsImporting] = useState(false);
  const [isExporting, updateIsExporting] = useState(false);
  const [isRefreshingMedia, updateIsRefreshingMedia] = useState(true);
  const [isUpdatingStoryAssets, updateIsUpdatingStoryAssets] = useState(true);

  const value = {
    state: {
      isInitializingIndexDB,
      isImporting,
      isExporting,
      isRefreshingMedia,
      isUpdatingStoryAssets,
    },
    actions: {
      updateIsInitializingIndexDB,
      updateIsImporting,
      updateIsExporting,
      updateIsRefreshingMedia,
      updateIsUpdatingStoryAssets,
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

StoryStatusProvider.propTypes = {
  children: PropTypes.node,
};

export default StoryStatusProvider;

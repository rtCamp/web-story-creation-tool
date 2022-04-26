/**
 * External dependencies
 */
import React from "react";
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";

/**
 * Internal dependencies
 */
import { fetchStories, updateStory, trashStory } from "../api/dashboard";
import { GlobalStyle } from "./theme";

const CustomDashboard = () => {
  const config = {
    newStoryURL: `/editor`,
    apiCallbacks: {
      fetchStories,
      updateStory,
      trashStory,
    },
  };

  return (
    <Dashboard config={config}>
      <GlobalStyle />
      <InterfaceSkeleton />
    </Dashboard>
  );
};

export default CustomDashboard;

/**
 * External dependencies
 */
import React from "react";
import { Dashboard, InterfaceSkeleton } from "@googleforcreators/dashboard";

/**
 * Internal dependencies
 */
import { fetchStories } from "../api/dashboard";
import { GlobalStyle } from "./theme";

const CustomDashboard = () => {
  const config = {
    newStoryURL: `/editor`,
    apiCallbacks: {
      fetchStories,
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

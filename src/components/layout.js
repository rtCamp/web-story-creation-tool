/**
 * External dependencies
 */
import React from "react";
import { InterfaceSkeleton } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import { Header } from "./header";
import { StoryStatusProvider } from "../app/storyStatus";

export default function Layout() {
  
  return (
    <StoryStatusProvider>
      <InterfaceSkeleton header={<Header />} />
    </StoryStatusProvider>
  );
}

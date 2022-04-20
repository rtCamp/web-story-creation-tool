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
import useUpdateStoryAssets from "../app/indexedDBMedia/useUpdateStoryAssets";

export default function Layout() {
  useUpdateStoryAssets();
  return (
    <StoryStatusProvider>
      <InterfaceSkeleton header={<Header />} />
    </StoryStatusProvider>
  );
}

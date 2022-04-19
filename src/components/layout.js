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
import { usePersistentAssets } from "../app/media/utils";

export default function Layout() {
  usePersistentAssets();
  return (
    <StoryStatusProvider>
      <InterfaceSkeleton header={<Header />} />
    </StoryStatusProvider>
  );
}

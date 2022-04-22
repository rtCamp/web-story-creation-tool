/**
 * External dependencies
 */
import React from "react";
import { InterfaceSkeleton } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import { Header } from "./header";
import useUpdateStoryAssets from "../app/indexedDBMedia/useUpdateStoryAssets";

export default function Layout() {
  useUpdateStoryAssets();
  return <InterfaceSkeleton header={<Header />} />;
}

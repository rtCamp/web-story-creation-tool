/**
 * External dependencies
 */
import React from "react";
import { InterfaceSkeleton } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import { Header } from "./header";

export default function Layout() {
  return <InterfaceSkeleton header={<Header />} />;
}

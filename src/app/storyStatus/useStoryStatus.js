/**
 * External dependencies
 */
import { identity, useContextSelector } from "@googleforcreators/react";
/**
 * Internal dependencies
 */
import Context from "./context";

function useConfig(selector = identity) {
  return useContextSelector(Context, selector);
}

export default useConfig;


/**
 * External dependencies
 */
import { identity, useContextSelector } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import Context from './context';

function useMedia(selector) {
  return useContextSelector(Context, selector ?? identity);
}

export default useMedia;

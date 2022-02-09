/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useEffect, useCallback, useState } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';

export const FIRST_TAB_EPOCH_KEY = 'FIRST_TAB_EPOCH';

export const ENFORCE_SINGLE_TAB_MESSAGE = __(
  'App already open in other tab. Please close this tab and continue on the tab previously opened',
  'web-stories'
);

const checkIfFirstTab = () => {
  if (localStorage.getItem(FIRST_TAB_EPOCH_KEY)) {
    return false;
  } else {
    return true;
  }
};

export function useEnforceSingleTab() {
  const [isFirstTab] = useState(checkIfFirstTab());

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(FIRST_TAB_EPOCH_KEY);
  }, []);

  useEffect(() => {
    if (isFirstTab) {
      localStorage.setItem(FIRST_TAB_EPOCH_KEY, Date.now());
      window.addEventListener('beforeunload', clearLocalStorage);
    } else {
      alert(ENFORCE_SINGLE_TAB_MESSAGE);
    }
    return () => {
      if (isFirstTab) {
        window.removeEventListener('beforeunload', clearLocalStorage);
      }
    };
  }, [isFirstTab, clearLocalStorage]);

  return { isFirstTab };
}

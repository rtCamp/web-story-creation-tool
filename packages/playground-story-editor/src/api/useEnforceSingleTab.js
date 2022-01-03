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

export const FIRST_TAB_EPOCH_KEY = 'FIRST_TAB_EPOCH';

export const ENFORCE_SINGLE_TAB_MESSAGE =
  'App already open in other tab. Please close this tab and continue on the tab previously opened';

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

  const addListeners = useCallback(() => {
    window.addEventListener('beforeunload', clearLocalStorage);
  }, [clearLocalStorage]);

  const removeListeners = useCallback(() => {
    window.removeEventListener('beforeunload', clearLocalStorage);
  }, [clearLocalStorage]);

  useEffect(() => {
    if (isFirstTab) {
      localStorage.setItem(FIRST_TAB_EPOCH_KEY, Date.now());
      addListeners();
    } else {
      alert(ENFORCE_SINGLE_TAB_MESSAGE);
    }
    return () => {
      if (isFirstTab) {
        removeListeners();
      }
    };
  }, [isFirstTab, addListeners, removeListeners]);

  return { isFirstTab };
}

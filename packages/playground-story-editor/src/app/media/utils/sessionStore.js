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
const SESSION_KEY = 'google-ad-story-config';

/**
 * Save data on session storage.
 *
 * @param {Object} data data to save on session storage.
 */
export const saveDataOnSessionStorage = function (data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

/**
 * Get data from session storage.
 *
 * @return {Object} parsed json object from session storage.
 */
export const getDataFromSessionStorage = function () {
  const result = sessionStorage.getItem(SESSION_KEY);
  return result ? JSON.parse(result) : '';
};

/**
 * Remove session session storage.
 */
export const removeSessionStorage = function () {
  sessionStorage.removeItem(SESSION_KEY);
};

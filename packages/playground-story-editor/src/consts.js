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

export const LOCAL_STORAGE_CONTENT_KEY = 'saved_story';

export const LOCAL_STORAGE_PREVIEW_MARKUP_KEY = 'preview_markup';

export const maxUpload = 314572800;

export const allowedMimeTypes = {
  image: [
    'image/webp',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
  ],
  audio: [],
  video: ['video/mp4', 'video/webm'],
};

export const COMMON_MIME_TYPE_MAPPING = {
  'image/gif': 'gif',
  'image/jpeg': 'jpeg',
  'image/png': 'jpeg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export const DB_NAME = 'Creation_tool_assets';
export const DB_VERSION = '1';
export const ASSET_OBJECT_STORE_NAME = 'assets';
export const STORY_OBJECT_STORE_NAME = 'stories';
export const ASSET_OBJECT_KEY = 'files';

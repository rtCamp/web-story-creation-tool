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
export const defaultStory = {
  title: { raw: '' },
  excerpt: { raw: '' },
  permalink_template: 'https://example.org/web-stories/%pagename%/',
  style_presets: {
    colors: [],
    textStyles: [],
  },
  date: '2021-10-26T12:38:38', // Publishing field breaks if date is not provided.
};

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

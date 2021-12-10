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

import { useSnackbar } from '@web-stories-wp/design-system';
import { useStory } from '@web-stories-wp/story-editor';
import JSZip from 'jszip';

const INPUT_ID = 'hidden-import-file-input';

function useStoryImport() {
  const { showSnackbar } = useSnackbar();
  const {
    internal: { restore },
  } = useStory();

  const handleFile = async (event) => {
    const inputFiles = event.target.files;

    if (!inputFiles.length || 'application/zip' !== inputFiles[0]?.type) {
      showSnackbar({
        message:
          'Please upload the zip file previously downloaded from this tool',
        dismissable: true,
      });
    }
    const [file] = inputFiles;
    const files = await JSZip.loadAsync(file).then((content) => content.files);

    if (!('config.json' in files)) {
      showSnackbar({ message: 'Zip file is not compatible with this tool' });
      return;
    }

    const configData = await files['config.json'].async('text');

    let importedState = {};

    try {
      importedState = JSON.parse(configData);
    } catch (e) {
      showSnackbar({
        message: 'Invalid configuration in the uploaded zip',
      });
    }
    restore(importedState);
  };

  const renderGhostInput = () => {
    if (document.getElementById(INPUT_ID)) {
      return;
    }
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('id', INPUT_ID);
    hiddenInput.setAttribute('type', 'file');
    hiddenInput.setAttribute('hidden', true);
    hiddenInput.setAttribute('multiple', true);
    hiddenInput.addEventListener('change', handleFile);
    hiddenInput.setAttribute('allowed', 'application/zip');

    document.body.appendChild(hiddenInput);
  };

  const initImport = () => {
    const ele = document.getElementById(INPUT_ID);

    if (ele) {
      ele.click();
    }
  };
  return {
    renderGhostInput,
    initImport,
  };
}

export default useStoryImport;

/*
 * Copyright 2022 Google LLC
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
import { useEffect, useCallback, useMemo } from '@googleforcreators/react';
import { useConfig, useAPI } from '@googleforcreators/story-editor';

function useMediaPicker({ onClose }) {
  const { allowedMimeTypes } = useConfig();

  const {
    actions: { uploadMedia },
  } = useAPI();

  const allowedMimeTypesCommaSeperated = useMemo(() => {
    return [
      allowedMimeTypes.image.join(', '),
      allowedMimeTypes.video.join(', '),
    ].join(', ');
  }, [allowedMimeTypes]);

  const handleFileInput = useCallback(
    async (event) => {
      await Promise.all(
        [...event.target.files].map(async (file) => {
          await uploadMedia(file);
        })
      );
      onClose();
    },
    [uploadMedia, onClose]
  );

  const insertHiddenFileInput = useCallback(() => {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('id', 'hidden-file-input');
    hiddenInput.setAttribute('type', 'file');
    hiddenInput.setAttribute('hidden', true);
    hiddenInput.setAttribute('multiple', true);
    hiddenInput.addEventListener('change', handleFileInput);
    hiddenInput.setAttribute('allowed', allowedMimeTypesCommaSeperated);

    document.body.appendChild(hiddenInput);
  }, [allowedMimeTypesCommaSeperated, handleFileInput]);

  const openModal = () => {
    const ele = document.getElementById('hidden-file-input');
    if (ele) {
      ele.click();
    }
  };

  useEffect(() => {
    insertHiddenFileInput();
  }, [insertHiddenFileInput]);

  return { openModal };
}

export default useMediaPicker;


/**
 * External dependencies
 */
import { useEffect, useCallback, useMemo } from '@googleforcreators/react';
import { useConfig, useAPI } from '@googleforcreators/story-editor';

function useMediaPicker() {
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
    },
    [uploadMedia]
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

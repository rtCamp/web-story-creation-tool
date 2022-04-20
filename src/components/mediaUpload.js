/**
 * Internal dependencies
 */
import useMediaPicker from "../app/media/useMediaPicker";

function MediaUpload({ render, ...rest }) {
  const { openModal } = useMediaPicker(rest);

  return render(openModal);
}

export default MediaUpload;

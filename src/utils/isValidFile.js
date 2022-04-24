/**
 * Internal dependencies
 */
import { allowedMimeTypes, maxUpload } from "../consts";

export const isValidFile = (file) => {
  const allowedMimeTypesArray = [
    ...allowedMimeTypes.image,
    ...allowedMimeTypes.video,
  ];

  if (!allowedMimeTypesArray.includes(file.type)) {
    throw new Error({ message: "Invalid file type" });
  }

  if (file.size > maxUpload) {
    throw new Error({ message: "Max Upload Limit Exceeded" });
  }
};

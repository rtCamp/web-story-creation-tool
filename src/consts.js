export const LOCAL_STORAGE_CONTENT_KEY = "saved_story";

export const LOCAL_STORAGE_PREVIEW_MARKUP_KEY = "preview_markup";

export const maxUpload = 314572800;

export const allowedMimeTypes = {
  image: [
    "image/webp",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/svg+xml",
  ],
  audio: [],
  video: ["video/mp4", "video/webm"],
};

export const COMMON_MIME_TYPE_MAPPING = {
  "image/gif": "gif",
  "image/jpeg": "jpeg",
  "image/png": "jpeg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export const DB_NAME = "Creation_tool_assets";
export const DB_VERSION = "1";
export const ASSET_OBJECT_STORE_NAME = "assets";
export const STORY_OBJECT_STORE_NAME = "stories";
export const ASSET_OBJECT_KEY = "files";

const buffer = document.createElement("div");

export function escapeHTML(string) {
  // @todo: implement a cheaper way to escape HTML characters.
  buffer.textContent = string;
  return buffer.innerHTML;
}

export function isBlobURL(url) {
  return url.startsWith("blob");
}

export * from "./DBHelpers";
export * from "./getInitialStoryState";
export * from "./getResourceFromLocalFile";
export * from "./isValidFile";

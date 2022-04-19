/**
 * External dependencies
 */
import { useSnackbar } from "@googleforcreators/design-system";
import { useStory } from "@googleforcreators/story-editor";
import JSZip from "jszip";
/**
 * Internal dependencies
 */
// import { getResourceFromLocalFile } from "../media/utils";
// import { useMedia } from "../media";
import { useStoryStatus } from "../storyStatus";

const INPUT_ID = "hidden-import-file-input";

function useStoryImport() {
  const { showSnackbar } = useSnackbar();
  const {
    actions: { updateIsImporting },
  } = useStoryStatus(({ actions }) => ({ actions }));
  const {
    internal: { restore, reducerState },
  } = useStory();

  //   const { media, updateMedia } = useMedia(
  //     ({ state: { media }, actions: { updateMedia } }) => {
  //       return { media, updateMedia };
  //     }
  //   );

  const handleFile = async (event) => {
    const inputFiles = event.target.files;
    updateIsImporting(true);

    if (!inputFiles.length || "application/zip" !== inputFiles[0]?.type) {
      showSnackbar({
        message:
          "Please upload the zip file previously downloaded from this tool",
        dismissable: true,
      });
      updateIsImporting(false);
      return;
    }
    const [file] = inputFiles;
    const files = await JSZip.loadAsync(file).then((content) => content.files);

    if (!("config.json" in files)) {
      showSnackbar({ message: "Zip file is not compatible with this tool" });
      updateIsImporting(false);
      return;
    }

    const configData = await files["config.json"].async("text");
    // const mediaItems = [...media];
    let importedState = {};

    try {
      importedState = JSON.parse(configData);
    } catch (e) {
      showSnackbar({
        message: "Invalid configuration in the uploaded zip",
      });
      updateIsImporting(false);
      return;
    }
    const stateToRestore = {
      ...importedState,
      story: {
        ...reducerState.story,
        ...importedState.story,
        title: importedState.story.title || "",
      },
      capabilities: reducerState.capabilities,
    };

    let elements = [];
    stateToRestore.pages.forEach((page) => {
      elements = [...elements, ...page.elements];
    });

    // const mediaTitles = media.map((mediaItem) => mediaItem.title);

    // await Promise.all(
    //   Object.keys(files).map(async (fileName, index) => {
    //     const currentFile = files[fileName];

    //     const elementIndex = elements.findIndex(
    //       (element) => element?.resource?.src === fileName
    //     );

    //     const { resource } = elementIndex >= 0 ? elements[elementIndex] : {};

    //     if (mediaTitles.includes(resource?.title)) {
    //       return;
    //     }

    //     if (["image", "video"].includes(resource?.type)) {
    //       const { mimeType } = resource;
    //       const blob = await currentFile?.async("blob");
    //       const mediaFile = new File([blob], currentFile.name, {
    //         type: mimeType,
    //       });

    //       if (!mediaFile) {
    //         return;
    //       }

    //       const { resource: mediaResource } = await getResourceFromLocalFile(
    //         mediaFile
    //       );
    //       const mediaSrc = mediaResource.src;

    //       const mediaItem = { ...mediaResource, ...resource };
    //       mediaItem.id = index + 1;
    //       mediaItem.src = mediaSrc;
    //       mediaItem.local = false;
    //       mediaItem.file = mediaFile;
    //       if ("video" === resource.type) {
    //         const videoFileName = fileName.split(".")[0];
    //         const poster = `${videoFileName}-poster.jpeg`;

    //         // Poster is not available in resource, so it will not be pushed to media.
    //         if (files[poster]) {
    //           const posterBlob = await files[poster]?.async("blob");
    //           const posterMediaFile = new File([posterBlob], poster, {
    //             type: "image/jpeg",
    //           });

    //           if (posterMediaFile) {
    //             const { resource: posterResource } =
    //               await getResourceFromLocalFile(posterMediaFile);

    //             mediaItem.poster = posterResource.src;
    //             mediaItem.local = false;
    //             elements[elementIndex].resource.poster = posterResource.src;
    //           }
    //         }
    //       }

    //       elements[elementIndex].resource.src = mediaSrc;

    //       mediaItems.push(mediaItem);
    //     }
    //   })
    // );

    // updateMedia((prevMedia) => {
    //   const prevMediaTitles = prevMedia.map((mediaItem) => mediaItem.alt);
    //   const filteredMedia = mediaItems.filter(
    //     (mediaItem) => !prevMediaTitles.includes(mediaItem.alt)
    //   );
    //   return [...prevMedia, ...filteredMedia];
    // });
    restore(stateToRestore);

    updateIsImporting(false);
  };

  const renderGhostInput = () => {
    if (document.getElementById(INPUT_ID)) {
      return;
    }
    const hiddenInput = document.createElement("input");
    hiddenInput.setAttribute("id", INPUT_ID);
    hiddenInput.setAttribute("type", "file");
    hiddenInput.setAttribute("hidden", true);
    hiddenInput.setAttribute("multiple", true);
    hiddenInput.addEventListener("change", handleFile);
    hiddenInput.setAttribute("allowed", "application/zip");

    document.body.appendChild(hiddenInput);
  };

  const importStory = () => {
    const ele = document.getElementById(INPUT_ID);

    if (ele) {
      ele.click();
    }
  };
  return {
    renderGhostInput,
    importStory,
  };
}

export default useStoryImport;

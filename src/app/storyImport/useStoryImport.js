/**
 * External dependencies
 */
import { useSnackbar } from "@googleforcreators/design-system";
import { useStory } from "@googleforcreators/story-editor";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
/**
 * Internal dependencies
 */
import { useStoryStatus } from "../storyStatus";
import { addToDB, getFromDB } from "../indexedDBMedia/utils/DBHelpers";
import getResourceFromLocalFile from "../indexedDBMedia/utils/getResourceFromLocalFile";
import { allowedMimeTypes } from "../../consts";

const INPUT_ID = "hidden-import-file-input";

function useStoryImport() {
  const { showSnackbar } = useSnackbar();
  const {
    actions: { updateIsImporting },
  } = useStoryStatus(({ actions }) => ({ actions }));

  const { restore } = useStory((state) => ({
    restore: state.internal.restore,
  }));

  const handleImport = async (zipFile) => {
    updateIsImporting(true);
    try {
      // check if imported file is .zip.
      if ("application/zip" !== zipFile?.type) {
        throw new Error(
          "Please upload the zip file previously downloaded from this tool"
        );
      }

      // check if zip file has a config.json.
      const files = await JSZip.loadAsync(zipFile).then(
        (content) => content.files
      );

      if (!("config.json" in files)) {
        throw new Error("Zip file is not compatible with this tool");
      }

      // unload config.json to new story state.
      let importedState;
      try {
        const configData = await files["config.json"].async("text");
        importedState = JSON.parse(configData);
      } catch (e) {
        throw new Error("Corrupted config.json file");
      }

      const stateToRestore = {
        ...importedState,
        story: {
          ...importedState.story,
          title: importedState.story.title || "",
        },
      };

      let elementsInImportedStory = [];
      stateToRestore.pages.forEach((page) => {
        elementsInImportedStory = [
          ...elementsInImportedStory,
          ...page.elements,
        ];
      });

      const filesInDB = await getFromDB();
      const mediaTitles = filesInDB.map((mediaItem) => mediaItem.title);

      // upload each file while updating its URL in new story state.
      await Promise.all(
        Object.keys(files).map(async (fileName) => {
          const currentFile = files[fileName];

          const elementIndex = elementsInImportedStory.findIndex(
            (element) => element?.resource?.src === fileName
          );

          const { resource } =
            elementIndex >= 0 ? elementsInImportedStory[elementIndex] : {};

          //ignore if resource is undefined
          if (!resource) {
            console.log("ignore if resource is undefined");
            return;
          }

          //ignore if file with same name already in DB
          if (mediaTitles.includes(resource?.title)) {
            console.log("//ignore if file with same name already in DB");
            return;
          }

          //ignore if not a valid mimeType
          if (
            ![...allowedMimeTypes.video, ...allowedMimeTypes.image].includes(
              resource?.mimeType
            )
          ) {
            console.log("//ignore if not a valid mimeType");
            return;
          }

          const { mimeType } = resource;
          const blob = await currentFile?.async("blob");
          const mediaFile = new File([blob], currentFile.name, {
            type: mimeType,
          });

          if (!mediaFile) {
            return;
          }

          const { resource: mediaResource } = await getResourceFromLocalFile(
            mediaFile
          );
          const mediaSrc = mediaResource.src;

          const mediaItem = { ...mediaResource, ...resource };
          mediaItem.id = uuidv4();
          mediaItem.src = mediaSrc;
          mediaItem.local = false;
          mediaItem.file = mediaFile;

          // If resource is a video search for a poster file, if found add it to DB.
          // Poster is not available in resource, so it will not be pushed to media.

          if ("video" === resource.type) {
            const videoFileName = fileName.split(".")[0];
            const poster = `${videoFileName}-poster.jpeg`;

            //
            if (files[poster]) {
              const posterBlob = await files[poster]?.async("blob");
              const posterMediaFile = new File([posterBlob], poster, {
                type: "image/jpeg",
              });

              if (posterMediaFile) {
                const { resource: posterItem } = await getResourceFromLocalFile(
                  posterMediaFile
                );

                posterItem.id = uuidv4();
                posterItem.src = mediaSrc;
                posterItem.file = mediaFile;
                posterItem.mediaSource = "poster-generation";

                mediaItem.poster = posterItem.src;
                mediaItem.local = false;
                elementsInImportedStory[elementIndex].resource.poster =
                  posterItem.src;
                mediaItem.posterId = posterItem.id;

                await addToDB(posterItem);
              }
            }
          }
          elementsInImportedStory[elementIndex].resource.src = mediaSrc;
          await addToDB(mediaItem);
        })
      );
      console.log(stateToRestore);

      const updatedPages = stateToRestore.pages.map((page) => {
        if (page?.elements.length > 1) {
          const updatedElements = page.elements.map((element) => {
            const updatesElementsIds = elementsInImportedStory.map(
              (ele) => ele.id
            );

            if (!updatesElementsIds.includes(element.id)) {
              return element;
            } else {
              return elementsInImportedStory.find(
                (ele) => ele.id === element.id
              );
            }
          });
          page.elements = updatedElements;
        }
        return page;
      });

      stateToRestore.pages = updatedPages;

      restore(stateToRestore);

      updateIsImporting(false);
      showSnackbar({
        message: "Story Imported",
        dismissable: true,
      });
    } catch (e) {
      throw e;
    } finally {
      updateIsImporting(false);
    }

    // restore story state.

    // const [file] = inputFiles;

    // // const mediaItems = [...media];

    // const stateToRestore = {
    //   ...importedState,
    //   story: {
    //     ...importedState.story,
    //     title: importedState.story.title || "",
    //   },
    // };

    // restore(stateToRestore);

    // updateIsImporting(false);
  };

  const handleFile = async (event) => {
    if (event.target.files.length === 1) {
      await handleImport(event.target.files[0]);
    } else {
      showSnackbar({
        message: "Please upload a single file",
        dismissable: true,
      });
    }
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

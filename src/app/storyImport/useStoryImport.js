/**
 * External dependencies
 */
import { useSnackbar } from "@googleforcreators/design-system";
import JSZip from "jszip";
/**
 * Internal dependencies
 */
import { useStoryStatus } from "../storyStatus";

const INPUT_ID = "hidden-import-file-input";

function useStoryImport() {
  const { showSnackbar } = useSnackbar();
  const {
    actions: { updateIsImporting },
  } = useStoryStatus(({ actions }) => ({ actions }));


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

import { MarkdownUtil } from "@sahircansurmeli/react-mde";

const saveImage = {
  execute: async ({ initialState, textApi, context, l18n }) => {
    if (!context) {
      throw new Error("wrong context");
    }

    const {
      event,
      pasteOptions: { saveImage, multiple, accept },
    } = context;

    const items = isPasteEvent(context)
      ? dataTransferToArray(event.clipboardData.items)
      : isDragEvent(context)
      ? dataTransferToArray(event.dataTransfer.items)
      : fileListToArray(event.target.files);

    const filteredItems = filterItems(items, { multiple, accept });

    for (const index in filteredItems) {
      const blob = items[index];
      
      if (blob.size >= 9437184) {
        window.alert(`Error uploading ${blob.name}\nFile size cannot exceed 9 MB`);
        continue;
      }

      const initialState = textApi.getState();
      const breaksBeforeCount = MarkdownUtil.getBreaksNeededForEmptyLineBefore(
        initialState.text,
        initialState.selection.start
      );

      const breaksBefore = Array(breaksBeforeCount + 1).join("\n");
      const placeHolder = `${breaksBefore}![${l18n.uploadingImage}]()`;

      textApi.replaceSelection(placeHolder);

      const blobContents = await readFileAsync(blob);
      const savingImage = saveImage(blobContents, blob);
      const imageUrl = (await savingImage.next()).value;

      const newState = textApi.getState();
      const uploadingText = newState.text.slice(
        initialState.selection.start,
        initialState.selection.start + placeHolder.length
      );

      if (uploadingText === placeHolder) {
        textApi.setSelectionRange({
          start: initialState.selection.start,
          end: initialState.selection.start + placeHolder.length,
        });

        const realImageMarkdown = imageUrl
          ? `${breaksBefore}![image](${imageUrl})`
          : "";

        const selectionDelta = realImageMarkdown.length - placeHolder.length;

        textApi.replaceSelection(realImageMarkdown);
        textApi.setSelectionRange({
          start: newState.selection.start + selectionDelta,
          end: newState.selection.end + selectionDelta,
        });
      }
    }
  },
};

async function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function filterItems(items, { multiple, accept }) {
  let filteredItems = items;

  if (!multiple) {
    filteredItems = filteredItems.slice(0, 1);
  }

  if (accept) {
    const acceptedTypes = accept.split(",");
    const fileExtensions = new Set(
      acceptedTypes.filter((t) => /^\.\w+/.test(t)).map((t) => t.split(".")[1])
    );
    const mimeTypes = new Set(
      acceptedTypes.filter((t) => /^[-\w.]+\/[-\w.]+$/.test(t))
    );
    const anyTypes = new Set(
      acceptedTypes
        .filter((t) => /(audio|video|image)\/\*/.test(t))
        .map((t) => t.split("/")[0])
    );

    filteredItems = filteredItems.filter(
      (f) =>
        fileExtensions.has(f.name.split(".")[1]) ||
        mimeTypes.has(f.type) ||
        anyTypes.has(f.type.split("/")[0])
    );
  }

  return filteredItems;
}

function dataTransferToArray(items) {
  const result = [];
  for (const index in items) {
    const item = items[index];
    if (item.kind === "file") {
      result.push(item.getAsFile());
    }
  }
  return result;
}

function fileListToArray(list) {
  const result = [];
  for (let i = 0; i < list.length; i++) {
    result.push(list[i]);
  }
  return result;
}

function isPasteEvent(context) {
  return context.event.clipboardData !== undefined;
}

function isDragEvent(context) {
  return context.event.dataTransfer !== undefined;
}

export default saveImage;

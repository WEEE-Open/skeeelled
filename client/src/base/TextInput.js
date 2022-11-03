import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ReactMde, {
  getDefaultToolbarCommands,
} from "@sahircansurmeli/react-mde";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { insertTex, saveImage } from "./textInput/commands";
import PythonEditor from "react-python-editor";
import { Buffer } from "buffer";
import Jimp from "jimp";

import "@sahircansurmeli/react-mde/lib/styles/css/react-mde-all.css";
import "./textInput/textInput.css";
import  "./stylesheet/TextInput.scss"
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import "./MarkdownPreview.css";

const entryFiles = [
  {
    fullName: "main.py",
    shortName: "main.py",
    originalContent: `import micropip

# to install other libraries, simply copy the next line and replace numpy with the name of the library you want to install
await micropip.install("numpy")

# set up your imports here, below the libraries installation steps
import numpy as np

# at this point, you can run any standard Python code and the code from the libraries you have installed
print("Hello World")`,
    content: `import micropip

# to install other libraries, simply copy the next line and replace numpy with the name of the library you want to install
await micropip.install("numpy")

# set up your imports here, below the libraries installation steps
import numpy as np

# at this point, you can run any standard Python code and the code from the libraries you have installed
print("Hello World")`,
  },
];

function TextInput({
  value,
  onChange,
  selectedTab,
  onTabChange,
  childProps,
  pythonQuestion,
  dark,
}) {
  const [val, setVal] = useState("");
  const [selTab, setSelTab] = useState("write");
  const [base64Imgs, setBase64Imgs] = useState({});
  const [editorHeight, setEditorHeight] = useState("100px");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const uploadImage = async function* (data, file) {
    const filename = file.name.replace(/\[|\]|\(|\)/g, "");
    const [mime, b64] = data.split(";base64,");
    const buffer = Buffer(b64, "base64");

    const image = await Jimp.read(buffer);

    const processedBuffer =
      image.getWidth() > 1024 || image.getHeight() > 1024
        ? await image
            .scaleToFit(1024, 1024)
            .getBufferAsync(mime.split("data:").pop())
        : b64;

    const processedData =
      mime + ";base64," + processedBuffer.toString("base64");

    setBase64Imgs((prev) => {
      return {
        ...prev,
        [filename]: processedData,
      };
    });
    yield filename;
  };

  const generatePreviewMarkdown = async (markdown) => {
    const filenamesToReplace = Object.keys(base64Imgs);

    if (filenamesToReplace.length < 1) {
      return markdown;
    }

    const re = new RegExp(
      Object.keys(base64Imgs)
        .map(
          (fn) => `!\\[.*\\]\\(${fn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`
        )
        .join("|"),
      "gi"
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          markdown.replaceAll(re, (match) => {
            const alt = match.match(/!\[.*\]/);
            const fn = match.match(/\]\(.*\)/);
            if (!alt || !fn) {
              return match;
            }
            return `${alt[0]}(${base64Imgs[fn[0].slice(2, fn[0].length - 1)]})`;
          })
        );
      });
    });
  };

  const handleCopy = (file) => {
    const re = new RegExp("\n?```py\n# " + file.shortName + ".*```\n?", "gs");
    const prev = value || val;
    let newText;

    // DO NOT MODIFY
    const code = file.shortName.endsWith(".py")
      ? `
\`\`\`py
# ${file.shortName}

${file.content}
\`\`\`
`
      : `
\`\`\`
${file.content}
\`\`\`
`;

    const match = re.exec(prev);

    if (match) {
      newText =
        prev.substr(0, match.index) +
        code +
        prev.substr(re.lastIndex, prev.length);
      console.log(match.index, re.lastIndex);
    } else {
      newText = prev + code;
    }

    if (onChange) {
      onChange(newText);
    } else {
      setVal(newText);
    }
  };

  return (
    <Container className="python-editor-container" fluid>
      {!isFullScreen && (
        <ReactMde
          className={"hidden"}
          loadingPreview="Loading preview..."
          value={value || val}
          onChange={onChange || setVal}
          selectedTab={selectedTab || selTab}
          onTabChange={onTabChange || setSelTab}
          commands={{ "insert-tex": insertTex, "upload-img": saveImage }}
          toolbarCommands={[...getDefaultToolbarCommands(), ["insert-tex"]]}
          generateMarkdownPreview={async (markdown) => {
            const previewMarkdown = await generatePreviewMarkdown(markdown);
            return Promise.resolve(
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
              >
                {previewMarkdown}
              </ReactMarkdown>
            );
          }}
          childProps={childProps}
          paste={{
            saveImage: uploadImage,
            command: "upload-img",
            multiple: true,
          }}
        />
      )}
      {pythonQuestion && (
        <PythonEditor
          editorHeight={editorHeight}
          outputHeight={"5vh"}
          dark={dark}
          onCopy={handleCopy}
          projectFiles={entryFiles}
          backgroundColor={dark ? "#212529" : "#ffffff"}
          onFullScreen={(fs) => {
            setIsFullScreen(fs);
            if (fs) {
              setEditorHeight("55vh");
            } else {
              setEditorHeight("5vh");
            }
          }}
        />
      )}
    </Container>
  );
}

export default TextInput;

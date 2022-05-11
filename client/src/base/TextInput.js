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

import "@sahircansurmeli/react-mde/lib/styles/css/react-mde-all.css";
import "./textInput/textInput.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import "./MarkdownPreview.css";

function TextInput({ value, onChange, selectedTab, onTabChange, childProps }) {
  const [val, setVal] = useState("");
  const [selTab, setSelTab] = useState("write");
  const [base64Imgs, setBase64Imgs] = useState({});

  const uploadImage = async function* (data, file) {
    setBase64Imgs(prev => {
      return {
        ...prev,
        [file.name]: data
      }
    });
    yield file.name;
  };

  const generatePreviewMarkdown = async (markdown) => {
    const filenamesToReplace = Object.keys(base64Imgs);

    if (filenamesToReplace.length < 1) {
      return markdown;
    }

    const re = new RegExp(
      Object.keys(base64Imgs).map(fn => `!\\[.*\\]\\(${fn}\\)`).join("|"),
      "gi"
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(markdown.replaceAll(re, (match) => {
          const alt = match.match(/!\[.*\]/);
          const fn = match.match(/\]\(.*\)/);
          if (!alt || !fn) {
            return match;
          }
          return `${alt[0]}(${base64Imgs[fn[0].slice(2, fn[0].length - 1)]})`;
        }));
      });
    });
  }

  return (
    <Container>
      <ReactMde
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
          multiple: true
        }}
      />
    </Container>
  );
}

export default TextInput;

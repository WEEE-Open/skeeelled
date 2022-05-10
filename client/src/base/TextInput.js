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
import "./QuestionPreview.css";

function _arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

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

  const generatePreviewMarkdown = (markdown) => {
    const re = new RegExp(
      Object.keys(base64Imgs).map(fn => `\\!\\[.*\\]\\(${fn}\\)`).join("|"),
      "gi"
    );

    return markdown.replaceAll(re, (matched) => {
      const alt = matched.match(/!\[.*\]/)[0];
      const fn = matched.match(/\]\(.*\)/)[0];

      return `${alt}(${base64Imgs[fn.slice(2, fn.length-1)]})`;
    });
  } 

  return (
    <Container>
      <ReactMde
        value={value || val}
        onChange={onChange || setVal}
        selectedTab={selectedTab || selTab}
        onTabChange={onTabChange || setSelTab}
        commands={{ "insert-tex": insertTex, "upload-img": saveImage }}
        toolbarCommands={[...getDefaultToolbarCommands(), ["insert-tex"]]}
        generateMarkdownPreview={(markdown) => {
          const previewMarkdown = generatePreviewMarkdown(markdown);

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

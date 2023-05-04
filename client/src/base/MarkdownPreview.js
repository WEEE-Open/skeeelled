import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import parse from 'html-react-parser';
import { MathJax } from "better-react-mathjax";

import "./MarkdownPreview.css";

const htmlStyles = {
  display: "block",
};

const MarkdownPreview = React.memo(({ text, format }) => {
  return format === "html" 
  ? (
      <MathJax style={htmlStyles}>
        {parse(text)}
      </MathJax>
  ) : (
    <ReactMarkdown
      className="markdown-preview"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      {text}
    </ReactMarkdown>
    );
});

export default MarkdownPreview;

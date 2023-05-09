import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import "./MarkdownPreview.css";

const MarkdownPreview = React.memo(({ markdown, format }) => {
  return (
    <ReactMarkdown
      className="markdown-preview"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
    >
      {markdown}
    </ReactMarkdown>
  );
});

export default MarkdownPreview;

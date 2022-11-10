import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "./MarkdownPreview.css";

const MarkdownPreview = React.memo(({ markdown }) => {
  return (
    <ReactMarkdown
        className="markdown-preview"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      {markdown}
    </ReactMarkdown>
  );
});

export default MarkdownPreview;

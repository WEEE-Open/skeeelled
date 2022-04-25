import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

function QuestionPreview({ value }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      {value}
    </ReactMarkdown>
  );
}

export default QuestionPreview;
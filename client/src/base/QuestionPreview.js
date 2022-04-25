import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { Card, Row, Col } from "react-bootstrap";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

function QuestionPreview({ question }) {
  return (
    <Card>
      <Card.Header>
        <div class="d-flex justify-content-between">
          <div class="p2">{`${question.course_code} ${question.course_name}`}</div>
          <div class="p2">
            <small>Posted by {question.author} on&nbsp;
              {question.date.toLocaleDateString("it-IT", { year: 'numeric', month: 'numeric', day: 'numeric' })}
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {question.text}
        </ReactMarkdown>
      </Card.Body>
    </Card>
  );
}

export default QuestionPreview;
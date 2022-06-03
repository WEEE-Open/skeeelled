import React, { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { Card, Button } from "react-bootstrap";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

function QuestionPreview({ question }) {
  const [showAdvice, setShowAdvice] = useState(false);

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between">
          <div className="p2">{`${question.course_code} ${question.course_name}`}</div>
          <div className="p2">
            <small>
              Posted by {question.author} on&nbsp;
              {question.date.toLocaleDateString("it-IT", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <MarkdownPreview markdown={question.text} />
        {question.advice && (
          <Button
            className="btn-sm mt-5"
            onClick={() => {
              setShowAdvice(!showAdvice);
            }}
          >
            {showAdvice ? "Hide advice" : "Show advice"}
          </Button>
        )}
        {showAdvice && <h6 className="mt-3">{question.advice}</h6>}
      </Card.Body>
    </Card>
  );
}

export default QuestionPreview;

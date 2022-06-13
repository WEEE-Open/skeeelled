import React, { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { Card, Button } from "react-bootstrap";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

function QuestionPreview({ question, showhints }) {
  const [showAdvice, setShowAdvice] = useState(showhints || false);

  return (
    <Card>
      <Card.Header>
        <div class="d-flex justify-content-between">
          <div class="p2">{`${question.course_code} ${question.course_name}`}</div>
          <div class="p2">
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

import React, { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";
import "./stylesheet/QuestionPreview.css";
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
        <div className="d-flex justify-content-between">
          <div className="course-name">{`${question.course} ${question.title}`}</div>
          <div className="p2">
            <small className="question-create-date">
              {"Posted on " + question.timestamp
                // question.date.toLocaleDateString("it-IT", {
                //   year: "numeric",
                //   month: "numeric",
                //   day: "numeric",
                // })
              }
            </small>
            <br />
            <small className="question-source">
              by {question.owner} &nbsp;
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <MarkdownPreview markdown={question.content} />
        {question.hint && (
          <Button
            className="show-advice-button"
            onClick={() => {
              setShowAdvice(!showAdvice);
            }}
          >
            {showAdvice ? "Hide advice" : "Show advice"}
          </Button>
        )}
        {showAdvice && <h6 className="question-advice-shown">{question.hint}</h6>}
      </Card.Body>
    </Card>
  );
}

export default QuestionPreview;

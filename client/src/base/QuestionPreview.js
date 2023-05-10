import React, {useEffect, useState} from "react";
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
  const [questionPreviewed, setQuestionPreviewed] = useState(question[0])

  useEffect(()=> {
    setQuestionPreviewed(question[0])
  }, [question])

  return questionPreviewed && questionPreviewed._id? (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between">
          <div className="course-name">{`${questionPreviewed._id} ${questionPreviewed.name}`}</div>
          <div className="p2">
            <small className="question-create-date">
              {
                // "Posted on " + questionPreviewed.timestamp
                // question.date.toLocaleDateString("it-IT", {
                //   year: "numeric",
                //   month: "numeric",
                //   day: "numeric",
                // })
              }
            </small>
            <br />
            <small className="question-source">
              by {questionPreviewed.owner.username} &nbsp;
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <MarkdownPreview markdown={questionPreviewed.questiontext.text} />
        {/*{question.hint && (*/}
        {/*  <Button*/}
        {/*    className="show-advice-button"*/}
        {/*    onClick={() => {*/}
        {/*      setShowAdvice(!showAdvice);*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {showAdvice ? "Hide advice" : "Show advice"}*/}
        {/*  </Button>*/}
        {/*)}*/}
        {/*{showAdvice && (*/}
        {/*  <h6 className="question-advice-shown">{question.hint}</h6>*/}
        {/*)}*/}
      </Card.Body>
    </Card>
  ): <></>
}

export default QuestionPreview;

import {
  Row,
  Col,
  Container,
  Image,
  Card,
  Accordion,
  Button,
} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import MarkdownPreview from "./MarkdownPreview";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

// import "./ListEntry.css";
import "./stylesheet/ListEntry.css";
import QuestionPreview from "./QuestionPreview";
import { useEffect, useState } from "react";
import { UserSettings } from "../pages";

function ListEntryDefault(props) {
  return (
    <tr>
      {props.row.map((cell, i) => (
        <td key={i}>
          {props.dotted && <span className="table-dot">●</span>}
          {cell}
        </td>
      ))}
    </tr>
  );
}


function ListEntryCourses(props) {
  return (
    <tr>
      <td>{props.row["_id"]}</td>
      <td>
        {/* ROUTE: /course/course:id COMPONENT: <Questions/> */}
        <Link
          to={"/course/" + props.row["_id"]}
          state={{ courseId: props.row["_id"], title: props.row.name, query: props.row }}
          className="course-entry"
        >
          {props.row.name}
        </Link>
      </td>
      <td>{props.row.professors.map((prof) => {
          return prof.name;
      })}</td>
      {/*<td>{props.row.cfu}</td>*/}
    </tr>
  );
}

function ListEntryQuestions(props) {

  const locationState = useLocation().state;


  const timestamp = props.row.timestamp

  return (
    <div className="questionEntry">
      <Row>
        <Col>
          <Row>
            {/* ROUTE: /question/question:id COMPONENT: <Answer/> */}
            <Link to={"/question/" + props.row["_id"]} className="question"
                  state={{
                    questionId: props.row["_id"],
                      courseId: props.row.course
                  }}
           >
              {props.row.title}
            </Link>
          </Row>
          <Row>
            <Col>
              {props.row.tags.map((t, i) => (
                <Link key={i} to="" className="tags">
                  #{t}
                </Link>
              ))}
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="created-at">Created at:  {timestamp}</Row>
          <Row className="created-from">from  {props.row.owner}</Row>
        </Col>
      </Row>
      <Row>
        <Col>{props.row.excerpt}</Col>
      </Row>
    </div>
  );
}

function ListEntryAnswers(props) {
  return (
    <div className="answerEntry" key={props.row["_id"]}>
      <Row className="answerEntry-credential">
        <Col colSpan="2">
          <Row>
            <Col>
              {props.row.author}, {props.row.timestamp}
            </Col>
            <Col className="header-svg">
              <span className="reply-link mx-3">
                {/*{props.row.replies + " "}*/}
                <Image
                  src={process.env.PUBLIC_URL + "/icons/DISCUSSION.svg"}
                  width="28px"
                />
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <MarkdownPreview rowspan="3" markdown={props.row.content} />
      </Row>

      <Row>
        <Col className="answerEntry-vote">
          <Link to="">
            <Image
              className="up-vote"
              src={process.env.PUBLIC_URL + "/icons/arrow_up.svg"}
              width="18px"
              onClick={() => {}}
            />
          </Link>

          <div className="vote-number">
            {props.row["upvoted_by"] - props.row["downvoted_by"] > 0 && "+"}
            {props.row["upvoted_by"] - props.row["downvoted_by"]}
          </div>
          <Link to="">
            <Image
              className="down-vote"
              src={process.env.PUBLIC_URL + "/icons/arrow_down.svg"}
              width="18px"
              onClick={() => {}}
            />
          </Link>
        </Col>

        <Col>
          <Link to="/discussion/1">
            <Button className="reply-link">Reply</Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
}

function ListEntryReplies(props) {
  return (
    <div className="questionEntry">
      <Row>
        <Col className="reply-title">{props.row.reply}</Col>
        <Col className="created-time">Created at: {props.row.createdat}</Col>
      </Row>
      <Row className="tags">
        <Col className="author">from {props.row.author}</Col>
      </Row>
    </div>
  );
}

function ListEntryTest(props) {
  return (
    <tr>
      <td>{props.row.a}</td>
      <td>{props.row.b}</td>
      <td>{props.row.c}</td>
    </tr>
  );
}

function ListEntrySuggestion(props) {
  return (
    <Container>
      <Col>
        <Col>
          <Link
            to={"/suggestion/" + props.row.id}
            className="suggestion-question"
          >
            {props.row.question}
          </Link>
        </Col>
        <Col className="suggestion-created-by">from {props.row.author}</Col>
        <Col className="suggestion-created-at">
          Created at: {props.row.createdat}
        </Col>
      </Col>
    </Container>
  );
}

function ListEntrySimulationResult(props) {
  return (
    <Accordion.Item eventKey={props.accordionKey} key={props.accordionKey}>
      <Row>
        <Col>
          <Accordion.Header>
            <Col className="col-md-2">
              {props.row.isCorrect ? (
                <Image
                  width={"35px"}
                  src={process.env.PUBLIC_URL + "/icons/RIGHT.svg"}
                />
              ) : (
                <Image
                  width={"35px"}
                  src={process.env.PUBLIC_URL + "/icons/WRONG.svg"}
                />
              )}
            </Col>
            <Col className="simulation-result-accordion-question-number">
              <h6>Question {props.row.quizNum}</h6>
            </Col>
            <Col className="simulation-result-accordion-score">
              {props.row.isCorrect ? (
                <h6>Score: {props.row.score}</h6>
              ) : (
                <h6>Score: {props.row.penalty}</h6>
              )}
            </Col>
          </Accordion.Header>
        </Col>
      </Row>
      <Accordion.Body>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        {
          <Row>
            <Col>
              <h5>Your Answer: {props.row.ans}</h5>
            </Col>
            <Col>
              <h5>Correct Answer: {"C"}</h5>
              {/*props.row.correctAns*/}
            </Col>
          </Row>
        }
      </Accordion.Body>
    </Accordion.Item>
  );
}
function ListEntrySelection(props) {
  return <option value={props.key + 1}>{props.row}</option>;
}

function ListEntry(props) {
  return (
    <>
      {props.scope === "default" && (
        <ListEntryDefault row={props.row} dotted={props.dotted} />
      )}
      {props.scope === "courses" && <ListEntryCourses row={props.row} />}
      {props.scope === "questions" && <ListEntryQuestions row={props.row} />}
      {props.scope === "answers" && <ListEntryAnswers row={props.row} />}
      {props.scope === "replies" && <ListEntryReplies row={props.row} />}
      {props.scope === "test" && <ListEntryTest row={props.row} />}
      {props.scope === "suggestion" && <ListEntrySuggestion row={props.row} />}
      {props.scope === "simulationResult" && (
        <ListEntrySimulationResult
          row={props.row}
          accordionKey={props.accordionKey}
        />
      )}
      {props.scope === "selection" && <ListEntrySelection row={props.row} />}
    </>
  );
}

export default ListEntry;

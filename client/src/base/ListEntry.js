import {
  Row,
  Col,
  Container,
  Image,
  Card,
  Accordion,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
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
      <td>{props.row.code}</td>
      <td>
        <Link
          to={"/course/" + props.row.code}
          state={{ courseId: props.row.code, title: props.row.course }}
          className="course-entry"
        >
          {props.row.course}
        </Link>
      </td>
      <td>{props.row.professor}</td>
      <td>{props.row.cfu}</td>
    </tr>
  );
}

function ListEntryQuestions(props) {
  return (
    <div className="questionEntry">
      <Row>
        <Col>
          <Row>
            <Link to={"/question/" + props.row.id} className="question">
              {props.row.question}
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
          <Row className="created-at">Created at: {props.row.createdat}</Row>
          <Row className="created-from">from {props.row.author}</Row>
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
    <>
      <tr>
        <td colSpan="2">
          {props.row.author}, {props.row.createdat}
          {props.row.replies > 0 && (
            <span className="reply-link mx-3">
              {props.row.replies + " "}
              <Image
                src={process.env.PUBLIC_URL + "/icons/DISCUSSION.svg"}
                width="28px"
              />
            </span>
          )}
        </td>
      </tr>
      <tr>
        <td className="answerEntry">
          <Link to="">
            <Image
              src={process.env.PUBLIC_URL + "/icons/UP ARROW.svg"}
              width="18px"
              onClick={() => {}}
            />
          </Link>
        </td>
        <MarkdownPreview rowspan="3" markdown={props.row.answer} />
      </tr>
      <tr>
        <td className="answerEntry">
          {props.row.like - props.row.dislike > 0 && "+"}
          {props.row.like - props.row.dislike}
        </td>
      </tr>
      <tr>
        <td className="answerEntry">
          <Link to="">
            <Image
              src={process.env.PUBLIC_URL + "/icons/DOWN ARROW.svg"}
              width="18px"
              onClick={() => {}}
            />
          </Link>
        </td>
        <td>
          <Link to="/discussion/1">
            <Button className="reply-link">Reply</Button>
          </Link>
        </td>
      </tr>
    </>
  );
}

function ListEntryReplies(props) {
  return (
    <div className="questionEntry">
      <Row>
        <Col>{props.row.reply}</Col>
      </Row>
      <Row className="tags">
        <Col>from {props.row.author}</Col>
        <Col>Created at: {props.row.createdat}</Col>
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
                  width={"18px"}
                  src={process.env.PUBLIC_URL + "/icons/CHECKMARK.svg"}
                />
              ) : (
                <Image
                  width={"18px"}
                  src={process.env.PUBLIC_URL + "/icons/x.svg"}
                />
              )}
            </Col>
            <Col>
              <h6>Question {props.row.quizNum}</h6>
            </Col>
            <Col>
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

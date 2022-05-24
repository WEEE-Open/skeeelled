import { Row, Col, Container, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "./ListEntry.css";

function ListEntryDefault(props) {
  return (
    <tr>
      {props.row.map((cell) => (
        <td>
          {props.dotted && <span className="greenDot">●</span>}
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
          <Link to={"/question/" + props.row.id} className="question">
            {props.row.question}
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>from {props.row.author}</Col>
        <Col>Created at: {props.row.createdat}</Col>
      </Row>
      <Row>
        <Col>
          {props.row.tags.map((t) => (
            <Link to="" className="tags">
              #{t}
            </Link>
          ))}
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
        <ReactMarkdown
          rowspan="2"
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {props.row.answer}
        </ReactMarkdown>
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
          <Link to="/discussion/1"><Button className="reply-link">{props.row.replies>0 && "("+props.row.replies+") "}Reply</Button></Link>
        </td>
      </tr>
    </>
  );
}

function ListEntryReplies(props) {
  return (
    <div className="questionEntry">
      <Row>
        <Col>
          {props.row.reply}
        </Col>
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
        <Col>from {props.row.author}</Col>
        <Col>Created at: {props.row.createdat}</Col>
      </Col>
    </Container>
  );
}

function ListEntrySelection(props) {
  return (
    <option value={props.key+1}>{props.row}</option>
  );
}

function ListEntry(props) {
  return (
    <>
      {props.scope === "default" && <ListEntryDefault row={props.row} dotted={props.dotted}/>}
      {props.scope === "courses" && <ListEntryCourses row={props.row} />}
      {props.scope === "questions" && <ListEntryQuestions row={props.row} />}
      {props.scope === "answers" && <ListEntryAnswers row={props.row} />}
      {props.scope === "replies" && <ListEntryReplies row={props.row} />}
      {props.scope === "test" && <ListEntryTest row={props.row} />}
      {props.scope === "suggestion" && <ListEntrySuggestion row={props.row} />}
      {props.scope === "selection" && <ListEntrySelection row={props.row} />}
    </>
  );
}

export default ListEntry;

import { Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListEntry, Recent, SearchBar, TextInput } from "../base";
import "./stylesheet/Replies.css";
import API from "../api/API";
import ReplyObj from "../entities/ReplyObj";

function Answer(props) {
  return (
    <div className="questionEntry-discussion-answer">
      <Row>
        <Col>
          <h4>{props.ans.answer}</h4>
        </Col>
        <Col className="question-created-time">
          Created at: {props.ans.createdat}
        </Col>
      </Row>
      <Row>
        <Col className="question-author">from {props.ans.author}</Col>
      </Row>
    </div>
  );
}

function Replies() {
  const answer = {
    answer: "Lorem ipsum dolor sit amet",
    author: "Jim",
    createdat: "10/10/1010",
  };

  const [replies, setReplies] = useState([]);

  useEffect(() => {
    API.getReplies("6380eae7306106889038c590").then((_replies) => {
      setReplies(_replies);
    });
  }, []);

  return (
    <div className="discussion">
      <Answer ans={answer} />
      <List scope="replies" rows={replies} />
      <TextInput />
      <Button className="reply-button my-2">Reply</Button>
    </div>
  );
}

export default Replies;

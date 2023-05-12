import { Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { List, ListEntry, Recent, SearchBar, TextInput } from "../base";
import "./stylesheet/Replies.css";
import API from "../api/API";
import ReplyObj from "../entities/ReplyObj";
import { dateToLocaleString } from "../utils";

function Answer(props) {
  console.log(props.ans);
  return (
    <div className="questionEntry-discussion-answer">
      <Row>
        <Col>
          <h4>{props.ans?.content}</h4>
        </Col>
        <Col className="question-created-time">
          Created at: {dateToLocaleString(props.ans?.timestamp)}
        </Col>
      </Row>
      <Row>
        <Col className="question-author">
          from {props.ans?.author?.username}
        </Col>
      </Row>
    </div>
  );
}

function Replies() {
  const { commentid } = useParams();

  const [answer, setComment] = useState({});
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    API.getComment(commentid).then((_comment) => {
      setComment(_comment);
    });
    API.getReplies(commentid).then((_replies) => {
      console.log("_replies", _replies);
      setReplies(_replies);
    });
  }, [commentid]);

  return (
    <div className="discussion">
      <Answer ans={answer} />
      <List
        scope="replies"
        rows={replies?.replies?.map((r) => ({ reply: r })) || []}
      />
      <TextInput />
      <Button className="reply-button my-2">Reply</Button>
    </div>
  );
}

export default Replies;

import { Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListEntry, Recent, SearchBar, TextInput } from "../base";
import "./Replies.css";

function Answer(props) {
  return (
    <div className="questionEntry">
      <Row>
        <Col>
          <h4>{props.ans.answer}</h4>
        </Col>
      </Row>
      <Row >
        <Col>from {props.ans.author}</Col>
        <Col>Created at: {props.ans.createdat}</Col>
      </Row>
    </div>
  );
}

function Replies() {
    const answer = {
        answer:"Lorem ipsum dolor sit amet",
        author:"Jim",
        createdat:"10/10/1010"
    }
    const fakeReplies = [
      {
        id: 1,
        reply: "I think it's correct",
        author: "Donato",
        createdat: "15:20 12/01/2021",
      },
      {
        id: 2,
        reply: "Maybe is wrong",
        author: "Jim",
        createdat: "17:30 13/02/2021",
      },
      {
        id: 3,
        reply: "idk",
        author: "Derek",
        createdat: "19:40 14/03/2021",
      },
    ];

    const [replies,setReplies] = useState(fakeReplies);

    return(<>
        <Answer ans={answer}/>
        <List scope="replies" rows={replies}/>
        <TextInput/>
        <Button className="reply-button my-2">Reply</Button>
    </>);
}

export default Replies;
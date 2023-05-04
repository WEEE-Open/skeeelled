import { Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListEntry, Recent, SearchBar, TextInput } from "../base";
import "./stylesheet/Replies.css";
import API from "../api/API";
import ReplyObj from "../entities/ReplyObj";
import { GlobalStateContext } from "../GlobalStateProvider";

function MyReplies() {
  const { userID } = useContext(GlobalStateContext);

  const [replies, setReplies] = useState([]);

  useEffect(() => {
    API.getMyReplies(userID, 1, 5).then((_replies) => {
      setReplies(_replies);
    });
  }, []);

  return (
    <div className="discussion">
      <List scope="replies" rows={replies} />
      <TextInput />
      <Button className="reply-button my-2">Reply</Button>
    </div>
  );
}

export default MyReplies;

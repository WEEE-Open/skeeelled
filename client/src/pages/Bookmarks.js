import { Card, Container } from "react-bootstrap";
import { List, MyPagination, SearchBar } from "../base";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./stylesheet/Bookmarks.scss";
import API from "../api/API";
import { GlobalStateContext } from "../GlobalStateProvider";

export default function Bookmarks() {
  const { userID } = useContext(GlobalStateContext);

  const [myBookmarkedQuestions, setMyBookmarkedQuestions] = useState([]);

  useEffect(() => {
    API.getMyBookmarkedQuestions(userID).then((questions) => {
      setMyBookmarkedQuestions(questions["myBookmarkedQuestions"]);
    });
  }, [userID]);

  return (
    <>
      <Container className="bookmarks-container">
        <List
          scope={"bookmarks"}
          title={"Bookmarked Questions"}
          rows={myBookmarkedQuestions}
        />
        {/* TODO: <MyPagination />*/}
      </Container>
    </>
  );
}

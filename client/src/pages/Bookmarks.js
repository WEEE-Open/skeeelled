import { Card, Container } from "react-bootstrap";
import { List, MyPagination, SearchBar } from "../base";
import {useContext, useState} from "react";
import { useLocation } from "react-router-dom";
import "./stylesheet/Bookmarks.scss";
import API from "../api/API"
import {GlobalStateContext} from "../GlobalStateProvider";

export default function Bookmarks() {
  const location = useLocation(); // default state of scope, title, and rows

  const {myBookmarkedQuestions} = useContext(GlobalStateContext);

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

import { Card, Container } from "react-bootstrap";
import {List, MyPagination, SearchBar} from "../base";
import { useState } from "react";
import { useLocation } from "react-router-dom";


export default function Bookmarks() {
  const location = useLocation();
  return (
    <>
      <Container>
        <Card body>
          <h2>{location.state.title}</h2>
          <List
            scope={location.state.scope}
            title={""}
            rows={location.state.rows}
          />
          <MyPagination />
        </Card>
      </Container>
    </>
  );
}

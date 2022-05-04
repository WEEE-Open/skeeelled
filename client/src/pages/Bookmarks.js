import { Card, Container, Pagination } from "react-bootstrap";
import { List, SearchBar } from "../base";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function PaginationRow() {
  let [active, setActive] = useState(1);
  let items = [];
  for (let num = 1; num <= 5; num++) {
    items.push(
      <Pagination.Item
        key={num}
        active={num === active}
        onClick={() => {
          setActive((active = num));
        }}
      >
        {num}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.First />
      {items}
      <Pagination.Last />
    </Pagination>
  );
}

export default function Bookmarks() {
  const location = useLocation();
  return (
    <>
      <Container>
        <Card body>
          <h2>{location.state.title}</h2>
          <SearchBar />
          <List
            scope={location.state.scope}
            title={""}
            rows={location.state.rows}
          />
          <PaginationRow />
        </Card>
      </Container>
    </>
  );
}

import { List } from "../base";
import { Card, Container, Pagination } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./stylesheet/ListFullPage.css"

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

export default function ListFullPage() {
  const location = useLocation();
  return (
    <>
      <Container>
        <div className="list-full-page">
          <List
            scope={location.state.scope}
            title={location.state.title}
            rows={location.state.rows}
            rounded
            tiled
            dotted
          />
          {location.state.title === "My courses" ? <></> : <PaginationRow />}
        </div>
      </Container>
    </>
  );
}

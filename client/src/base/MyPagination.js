import { useState } from "react";
import { Pagination } from "react-bootstrap";
import "./stylesheet/MyPagination.scss";

export default function MyPagination(props) {
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
      <Pagination.Prev />
      {items}
      <Pagination.Next />
    </Pagination>
  );
}

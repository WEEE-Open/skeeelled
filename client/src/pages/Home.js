import { Row, Col, Card } from "react-bootstrap";
import { useState } from "react";
import "./Home.css";
import { ListGroup, SearchBar } from "../base/";

function Home() {
  const fake = [
    {
      scope: "default",
      title: "New questions in courses I'm enrolled in",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "default",
      title: "Replies",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "test",
      title: "My questions",
      rows: [
        { a: "aaa", b: "bbb", c: "ccc" },
        { a: "aaa", b: "bbb", c: "ccc" },
        { a: "aaa", b: "bbb", c: "ccc" },
      ],
    },
    {
      scope: "test",
      title: "My answers",
      rows: [
        { a: "aaa", b: "bbb", c: "ccc" },
        { a: "aaa", b: "bbb", c: "ccc" },
        { a: "aaa", b: "bbb", c: "ccc" },
      ],
    },
  ];

  const [tests, setTests] = useState(fake);

  return (
    <Card body>
      <Row lg={12} className="py-0 header">
        <Col>
          <h3>Hi, Name Surname!</h3>
        </Col>
      </Row>
      <ListGroup lists={tests} cols={2} tiled rounded dotted />
    </Card>
  );
}

export default Home;

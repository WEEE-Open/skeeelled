import { Row, Col, Card } from "react-bootstrap";
import { useState } from "react";
import "./stylesheet/Home.css";
import { ListGroup, SearchBar } from "../base/";

function Home() {
  const fake = [
    {
      scope: "default",
      title: "New questions in courses enrolled",
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
      scope: "default",
      title: "My questions",
      rows: [
        ["Cras justkjkkkkko odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "default",
      title: "My answers",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
  ];

  const [tests, setTests] = useState(fake);

  return (
    <>
      <Row lg={12} className="py-0 header">
        <Col>
          <h3>Hi, Name Surname!</h3>
        </Col>
      </Row>
      <div className="home-page-table">
        <ListGroup lists={tests} cols={2} tiled rounded dotted />
      </div>
    </>
  );
}

export default Home;

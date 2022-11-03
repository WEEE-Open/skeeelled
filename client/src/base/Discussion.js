import React, { useState } from "react";
import { Collapse, Row, Col, Form, Pagination, Button } from "react-bootstrap";

import List from "./List";
import "./stylesheet/Discussion.css";

const fakeAnswers = [
  {
    id: 1,
    answer: "$\\int_{a}^{b}{x^2 dx}$",
    author: "Donato",
    createdat: "15:20 12/01/2021",
    like: 5,
    dislike: 2,
    replies: 3,
  },
  {
    id: 2,
    answer: "Morbi leo risus porta ac consectetur ac",
    author: "Jim",
    createdat: "17:30 13/02/2021",
    like: 5,
    dislike: 7,
    replies: 0,
  },
  {
    id: 3,
    answer: "Vestibulum at eros",
    author: "Derek",
    createdat: "19:40 14/03/2021",
    like: 9,
    dislike: 1,
    replies: 1,
  },
];

const no_pages = 5;

function Discussion(props) {
  const [showDiscussion, setShowDiscussion] = useState(
    props.showdiscussion || false
  );
  const [answers, setAnswers] = useState(fakeAnswers);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="discussion-component">
      <Row>
        <Col lg="12">
          <Button
            onClick={() => setShowDiscussion((value) => !value)}
            aria-controls="example-collapse-text"
            aria-expanded={showDiscussion}
            className={`w-100 ${
              showDiscussion ? "btn-warning" : "btn-success"
            }`}
          >
            {showDiscussion ? "Hide discussion" : "Show discusssion"}
          </Button>
        </Col>
      </Row>

      <Collapse className="collapse" in={showDiscussion}>
        <Row>
          <Col lg="12">
            <Form.Group controlId="formGridState">
              <Form.Control placeholder="Search" />
            </Form.Group>
          </Col>
          <Col lg="12">
            <List scope="answers" rows={answers} />
          </Col>
          <Col lg="12" sm="12" md="12">
            <Pagination>
              {[...Array(no_pages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Col>
        </Row>
      </Collapse>
    </div>
  );
}

export default Discussion;

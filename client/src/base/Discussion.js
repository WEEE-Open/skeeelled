import React, { useState } from "react";
import { Collapse, Row, Col, Form, Pagination } from "react-bootstrap";

import List from "./List";

function Discussion({ show, title, answers, no_pages, current_page }) {
  return (
    <Collapse className="collapse" in={show}>
      <Row>
        <Col lg="12">
          <Form.Group controlId="formGridState">
            <Form.Control placeholder="Search" />
          </Form.Group>
        </Col>
        <Col lg="12">
          <List scope="answers" title={title} rows={answers} />
        </Col>
        <Col lg="12" sm="12" md="12">
          <Pagination>
            {
              [...Array(no_pages)].map((_, idx) => (
                <Pagination.Item key={idx + 1} active={current_page === idx + 1}>
                  {idx + 1}
                </Pagination.Item>
              ))
            }
          </Pagination>
        </Col>
      </Row>
    </Collapse>
  );
}

export default Discussion;
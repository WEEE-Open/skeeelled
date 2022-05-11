import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState, Component } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  Container,
  Button,
  Form,
  Stack,
  Modal,
} from "react-bootstrap";
import "./Simulation.css";
import { List, ListEntry, TextInput } from "../base";

export default function Simulation(props) {
  const simulationRandomQuizType = ["open", "close"];
  const [pageNum, setPageNum] = useState(1);

  const randomizer =
    simulationRandomQuizType[
      Math.floor(Math.random() * simulationRandomQuizType.length)
    ];
  const [quizType, setQuizType] = useState(randomizer);

  const locationState = useLocation().state;

  const FinishModal = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button
          className="btn-outline-success"
          variant="outline-success"
          onClick={handleShow}
        >
          Finish
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Submit Before the Time Limit?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Confirm your submission to see the result.</Modal.Body>
          <Modal.Footer>
            <Link
              className="outline-secondary"
              to={{ pathname: "/simulationresult/" + locationState.courseId }}
              state={{
                courseId: locationState.courseId,
                title: locationState.title,
                num: locationState.num,
                penalty: locationState.penalty,
                max: locationState.max,
                isMulti: locationState.isMulti,
                pointPerCorrectAns: locationState.max / locationState.num,
              }}
            >
              <Button className="btn-outline-success" variant="outline-success">
                Confirm
              </Button>
            </Link>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const PaginationRow = (props) => {
    let items = [];
    for (let num = 1; num <= props.numPage; num++) {
      items.push(
        <Pagination.Item
          key={num}
          active={num === pageNum}
          onClick={() => {
            setPageNum(num);
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
  };

  useEffect(() => {
    locationState.isMulti ? setQuizType("close") : setQuizType(randomizer);
  }, [pageNum]);

  return (
    <Container>
      <h3>{locationState.type + " Questions of " + locationState.title}</h3>
      <Row className="pagination-finish">
        <Col>
          <PaginationRow numPage={locationState.num} />
        </Col>
        <Col>
          <FinishModal />
        </Col>
      </Row>
      <Card className="simulation-question-card">
        <Stack gap={3}>
          <Card className="simulation-question-text-card">
            <h3>{"Question " + pageNum}</h3>
            <Card.Text>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum."
            </Card.Text>
          </Card>
          <Card.Body className="simulation-question-answer">
            {quizType === "open" ? (
              <TextInput />
            ) : (
              <Card className="simulation-question-answer-ratio-card">
                <Stack gap={1}>
                  {["A", "B", "C", "D"].map((e) => {
                    return <Form.Check type="checkbox" label={e} />;
                  })}
                </Stack>
              </Card>
            )}
          </Card.Body>
        </Stack>
      </Card>
    </Container>
  );
}

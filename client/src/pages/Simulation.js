import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState, Component, useRef } from "react";
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

const Duration = (props) => {
  const [timeIn, setTimeIn] = useState({
    h: Math.floor(parseInt(props.duration) / 60),
    m: parseInt(props.duration) % 60,
    s: 0,
  });

  useEffect(() => {
    const myInterval = setInterval(() => {
      setTimeIn((time) => {
        const updateTime = { ...time };
        if (time.s > 0) {
          updateTime.s--;
        }
        if (time.s === 0) {
          if (time.h === 0 && time.m === 0) {
            clearInterval(myInterval);
          } else if (time.m > 0) {
            updateTime.m--;
            updateTime.s = 59;
          } else if (time.h > 0) {
            updateTime.h--;
            updateTime.m = 59;
            updateTime.s = 59;
          }
        }
        return updateTime;
      });
    }, 1000);
    return () => clearInterval(myInterval);
  }, [timeIn]);

  return (
    <>
      <h3>
        {timeIn.h.toString().padStart(2, "0")}:
        {timeIn.m.toString().padStart(2, "0")}:
        {timeIn.s.toString().padStart(2, "0")}
      </h3>
    </>
  );
};

const FinishModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const timeIn =
    Math.floor(parseInt(props.duration) / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    (parseInt(props.duration) % 60).toString().padStart(2, "0") +
    ":" +
    (0).toString().padStart(2, "0");

  const [timeRecord, setTimeRecord] = useState({
    h: Math.floor(parseInt(props.duration) / 60),
    m: parseInt(props.duration) % 60,
    s: 0,
  });

  useEffect(() => {
    const myInterval = setInterval(() => {
      setTimeRecord((time) => {
        const updateTime = { ...time };
        if (time.s > 0) {
          updateTime.s--;
        }
        if (time.s === 0) {
          if (time.h === 0 && time.m === 0) {
            clearInterval(myInterval);
          } else if (time.m > 0) {
            updateTime.m--;
            updateTime.s = 59;
          } else if (time.h > 0) {
            updateTime.h--;
            updateTime.m = 59;
            updateTime.s = 59;
          }
        }
        return updateTime;
      });
    }, 1000);
    return () => clearInterval(myInterval);
  }, [timeRecord]);

  return (
    <>
      <Button
        className="btn-outline-success"
        variant="outline-success"
        onClick={handleShow}
      >
        Finish
      </Button>
      <Modal show={show} onHide={handleClose} className="simulation-modal">
        <Modal.Header closeButton>
          <Modal.Title>Submit Before the Time Limit?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm your submission to see the result.</Modal.Body>
        <Modal.Footer>
          <Link
            className="outline-secondary"
            to={{
              pathname: "/simulationresult/" + props.locationState.courseId,
            }}
            state={{
              courseId: props.locationState.courseId,
              title: props.locationState.title,
              num: props.locationState.num,
              penalty: props.locationState.penalty,
              max: props.locationState.max,
              isMulti: props.locationState.isMulti,
              pointPerCorrectAns:
                props.locationState.max / props.locationState.num,
              duration: timeIn,
              timeElapsed: `${timeRecord.h
                .toString()
                .padStart(2, "0")}:${timeRecord.m
                .toString()
                .padStart(2, "0")}:${timeRecord.s.toString().padStart(2, "0")}`,
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

export default function Simulation(props) {
  const locationState = useLocation().state;

  const simulationRandomQuizType = ["open", "close"];
  const [pageNum, setPageNum] = useState(1);
  const randomizer =
    simulationRandomQuizType[
      Math.floor(Math.random() * simulationRandomQuizType.length)
    ];
  const [quizType, setQuizType] = useState(randomizer);

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
      <Pagination id="simulation-page">
        <Pagination.First />
        {items}
        <Pagination.Last />
      </Pagination>
    );
  };

  // mock question type
  useEffect(() => {
    locationState.isMulti ? setQuizType("close") : setQuizType(randomizer);
  }, [pageNum]);

  return (
    <Container className="simulation-container">
      <h3>{locationState.type + " Questions of " + locationState.title}</h3>
      <Duration duration={locationState.duration} />
      <Row className="pagination-finish">
        <Col>
          <PaginationRow numPage={locationState.num} />
        </Col>
        <Col>
          <FinishModal
            locationState={locationState}
            duration={locationState.duration}
          />
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
                  {["A", "B", "C", "D"].map((e, i) => {
                    return <Form.Check key={i} type="checkbox" label={e} className="simulation-answer-checkbox" />;
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

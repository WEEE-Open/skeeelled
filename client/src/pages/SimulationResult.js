import { Link, useLocation } from "react-router-dom";
import {
  Card,
  Container,
  Table,
  Stack,
  Button,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import "./stylesheet/SimulationResult.css"; // scss file access
//import "./SimulationResult.css";
import { useState } from "react";
import { List } from "../base";

const timeUsedStr = (left, tot) => {
  let h, m, s;
  if (left.length !== tot.length) {
    return "";
  }
  for (let i = 0; i < left.length; i++) {
    if (i === 0) {
      h = tot[0] - left[0];
    }
    if (i === 1) {
      m = tot[1] - left[1];
      if (m < 0) {
        h -= 1;
        m = m + 60;
      }
    }
    if (i === 2) {
      s = tot[2] - left[2];
      if (s < 0) {
        m -= 1;
        s = s + 60;
      }
    }
  }
  return (
    h.toString().padStart(2, "0") +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
};

export default function SimulationResult() {
  const locationState = useLocation().state;

  const [numCorrect, setNumCorrect] = useState(locationState.num);
  const [numPenalty, setNumPenalty] = useState(0);

  const numNotGiven = locationState.num - numCorrect - numPenalty;
  const numQuiz = locationState.num;
  const maxScore = locationState.max;
  const pointPerWrong = locationState.penalty;
  const pointPerCorrect = locationState.pointPerCorrectAns;

  const mockCorrectAns = [];
  for (let i = 0; i < numQuiz; i++) {
    mockCorrectAns.push({
      id: locationState.courseId,
      quizNum: i + 1,
      ans: "C",
      score: pointPerCorrect,
      penalty: pointPerWrong,
      isCorrect: false,
    });
  }

  const mockUserAns = [];
  for (let i = 0; i < numQuiz; i++) {
    const randomAns = ["A", "B", "C", "D"];
    const random = Math.floor(Math.random() * randomAns.length);
    mockUserAns.push({
      id: locationState.courseId,
      quizNum: i + 1,
      ans: randomAns[random],
      score: pointPerCorrect,
      penalty: pointPerWrong,
      isCorrect: false,
    });
    mockUserAns[i].isCorrect = mockUserAns[i].ans === mockCorrectAns[i].ans;
  }

  const examDuration = locationState.duration.split(":").map((n) => {
    return Number(n);
  });
  const timeElapsed = locationState.timeElapsed.split(":").map((n) => {
    return Number(n);
  });

  const [useAns, setUserAns] = useState(mockUserAns);
  const [correctAns, setCorrectAns] = useState(mockCorrectAns);
  const [timeUsed, setTimeUsed] = useState(
    timeUsedStr(timeElapsed, examDuration)
  );

  return (
    <>
      <Container className="simulation-result-container">
        <Row className="simulation-result-title">
          <h2 className="simulation-result-title-text">Simulation Result</h2>
        </Row>
        <Row className="col-sm-8">
          <Col>
            <h3 className="simulation-title">{locationState.title}</h3>
          </Col>
          <Col>
            <Link
              className="simulation-result-start-button"
              to={{
                pathname: "/startsimulation/" + locationState.courseId,
              }}
              state={{
                courseId: locationState.courseId,
                title: locationState.title,
              }}
            >
              <Button className="start-button">
                <p>Start New Simulation</p>
              </Button>
            </Link>
          </Col>
        </Row>
        {/*<h3>*/}
        {/*  Time Used: {timeUsed} / {locationState.duration}{" "}*/}
        {/*</h3>*/}
        <Row>
          <div className="simulation-result-score">
            <h2 className="simulation-result-user-score">
              {numCorrect * pointPerCorrect -
                numPenalty * Math.abs(pointPerWrong)}
            </h2>
            <h2 className="simulation-result-max-score">/{maxScore}</h2>
          </div>
        </Row>
        {/*<Card className="result-table-card">*/}
          <Table responsive="lg" striped hover className="simulation-result-table">
            <thead b>
              <tr>
                <th>Result</th>
                <th>Number</th>
                <th>Points Each</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Correct Answer</td>
                <td>{numCorrect}</td>
                <td>{pointPerCorrect}</td>
                <td>{numCorrect * pointPerCorrect}</td>
              </tr>
              <tr>
                <td>Not Given</td>
                <td>{numNotGiven}</td>
                <td>0</td>
                <td>{numNotGiven * 0}</td>
              </tr>
              <tr>
                <td>Wrong Answer</td>
                <td>{numPenalty}</td>
                <td>{pointPerWrong}</td>
                <td>{numPenalty * pointPerWrong}</td>
              </tr>
            </tbody>
          </Table>
        <List scope={"simulationResult"} rows={useAns} />
      </Container>
    </>
  );
}

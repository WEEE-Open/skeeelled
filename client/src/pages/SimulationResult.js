import { useLocation } from "react-router-dom";
import { Card, Container, Table, Stack } from "react-bootstrap";
import "./SimulationResult.css";
import { useState } from "react";
import {List} from "../base";



export default function SimulationResult() {

  const locationState = useLocation().state;

  const [numCorrect, setNumCorrect] = useState(locationState.num);
  const [numPenalty, setNumPenalty] = useState(0);

  const numNotGiven = locationState.num - numCorrect - numPenalty;
  const numQuiz = locationState.num;
  const maxScore = locationState.max;
  const pointPerWrong = locationState.penalty;
  const pointPerCorrect = locationState.pointPerCorrectAns;

  const mockCorrectAns = []
  for(let i = 0; i < numQuiz; i++) {
    mockCorrectAns.push(
        {
          id: locationState.courseId,
          quizNum:i+1,
          ans:"C",
          score: pointPerCorrect,
          penalty: pointPerWrong,
          isCorrect:false,
        })
  }

  const mockUserAns = []
  for(let i = 0; i < numQuiz; i++) {
    const randomAns = ['A','B','C','D']
    const random = Math.floor(Math.random()*randomAns.length)
    mockUserAns.push(
        {
          id: locationState.courseId,
          quizNum:i+1,
          ans: randomAns[random],
          score: pointPerCorrect,
          penalty: pointPerWrong,
          isCorrect: false
        })
    mockUserAns[i].isCorrect = mockUserAns[i].ans === mockCorrectAns[i].ans
  }


  const [useAns, setUserAns] = useState(mockUserAns)
  const [correctAns,setCorrectAns] = useState(mockCorrectAns)

  return (
    <>
      <Container>
        <h3>Simulation Result of {locationState.title}</h3>
        <h3>Time Used: {locationState.duration} / {locationState.timeElapsed} </h3>
        <Card className="result-table-card">
          <h1>
            {numCorrect * pointPerCorrect -
              numPenalty * Math.abs(pointPerWrong)}
            /{maxScore}
          </h1>
          <Table striped bordered hover size="lg">
            <thead>
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
          <List scope={"simulationResult"}
                rows={useAns}
          />
        </Card>
      </Container>
    </>
  );
}

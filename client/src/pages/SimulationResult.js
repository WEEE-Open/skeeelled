import { useLocation } from "react-router-dom";
import {Card, Container, Table, Stack} from "react-bootstrap";
import "./SimulationResult.css"
import {useState} from "react";

export default function SimulationResult() {

  const locationState = useLocation().state;

  const [numCorrect, setNumCorrect] = useState(locationState.num);
  const [numPenalty, setNumPenalty] = useState(0);

  const numNotGiven = locationState.num - numCorrect - numPenalty
  const numQuiz = locationState.num;
  const maxScore = locationState.max;
  const pointPerWrong = locationState.penalty;
  const pointPerCorrect = locationState.pointPerCorrectAns

  return (
    <>
        <Container>
            <h3>Simulation Result of {locationState.title}</h3>
            <Card className="result-table-card">
                <h3>{numCorrect * pointPerCorrect - numPenalty * Math.abs(pointPerWrong)}/{maxScore}</h3>
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
            </Card>
        </Container>
    </>
  );
}

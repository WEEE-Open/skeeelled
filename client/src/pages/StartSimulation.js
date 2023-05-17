import {
  Card,
  Container,
  Form,
  Row,
  Col,
  Button,
  Stack,
  FloatingLabel,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import {Link, useLocation, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
// import "./StartSimulation.css";
import "./stylesheet/StartSimulation.css";
import {GlobalStateContext} from "../GlobalStateProvider";
import API from "../api/API";

export default function StartSimulation() {
  let {courseName} = useParams()
  const { userCourses, userID } = useContext(GlobalStateContext);

  const simulationTypes = ["Random", "Exam"];

  const [isMulti, setIsMulti] = useState(false);

  const [numQuestions, setNumQuestions] = useState(10);
  const [penaltyScore, setPenaltyScore] = useState(-0.5);
  const [maxScore, setMaxScore] = useState(30);
  const [duration, setDuration] = useState(60); /* unit: minute */
  const [userInput, setUserInput] = useState(1);
  const totNumOfQuestion = undefined;
  const [maxNumOfQuestion, setMaxNumOfQuestion] = useState(
    totNumOfQuestion ? totNumOfQuestion : 100
  );

  const locationState = useLocation().state;

  const [simulationQuestions, setSimulationQuestions] = useState([])

  useEffect(()=>{
    API.getQuestions(courseName).then((questions) => setSimulationQuestions(questions))
  }, [])

  console.log(simulationQuestions)

  return (
    <>
      <Container>
        <Card className="simulation-card">
          <Card.Body>
            <Stack gap={4}>
              <h3>Simulation Set Up</h3>
              <Col>
                <Stack gap={2}>
                  <Row>
                    <div key="checkbox-ratio" className="mb-3">
                      <Form.Switch
                        className="multiquiz-toggle"
                        type="switch"
                        label="Multiple Choice Questions Only (With Grade)"
                        onChange={() => setIsMulti(!isMulti)}
                      />
                    </div>
                  </Row>
                  {userInput || userInput === 0 ? (
                    maxNumOfQuestion > 100 ? (
                      <Alert variant="danger">
                        Maximum Number of question: {maxNumOfQuestion}
                      </Alert>
                    ) : numQuestions <= 0 || maxScore <= 0 || duration <= 0 ? (
                      <Alert variant="danger">
                        Number of Question, Maximum Score, and Duration Must Not
                        Be Zero
                      </Alert>
                    ) : (
                      <></>
                    )
                  ) : (
                    <Alert variant="danger">
                      Only Number Inputs Are Allowed
                    </Alert>
                  )}
                  <Stack gap={4}>
                    {isMulti ? (
                      <Row key={isMulti}>
                        <Stack gap={2}>
                          <h6>
                            ( Number of Question, Maximum Score, and Duration
                            Must Not Be Zero )
                          </h6>
                          <InputGroup key={isMulti}>
                            <InputGroup.Text>
                              Number of Questions
                            </InputGroup.Text>
                            <FormControl
                              aria-label={numQuestions}
                              placeholder={numQuestions}
                              onChange={(e) => {
                                setUserInput(Number(e.target.value));
                                setNumQuestions(Number(e.target.value));
                              }}
                            />
                          </InputGroup>
                          <InputGroup>
                            <InputGroup.Text>Penalty </InputGroup.Text>
                            <FormControl
                              aria-label={penaltyScore}
                              placeholder={penaltyScore}
                              onChange={(e) => {
                                setUserInput(Number(e.target.value));
                                setPenaltyScore(Number(e.target.value));
                              }}
                            />
                          </InputGroup>
                          <InputGroup>
                            <InputGroup.Text>Maximum Score</InputGroup.Text>
                            <FormControl
                              aria-label={maxScore}
                              placeholder={maxScore}
                              onChange={(e) => {
                                setUserInput(Number(e.target.value));
                                setMaxScore(Number(e.target.value));
                              }}
                            />
                          </InputGroup>
                          <InputGroup>
                            <InputGroup.Text>
                              Duration (Minutes)
                            </InputGroup.Text>
                            <FormControl
                              aria-label={duration}
                              placeholder={duration}
                              onChange={(e) => {
                                setUserInput(Number(e.target.value));
                                setDuration(Number(e.target.value));
                              }}
                            />
                          </InputGroup>
                        </Stack>
                      </Row>
                    ) : (
                      <></>
                    )}
                    <Row className="bottom-group">
                      {numQuestions &&
                      maxScore &&
                      !isNaN(penaltyScore) &&
                      duration &&
                      numQuestions <= maxNumOfQuestion ? (
                        simulationTypes.map((type, i) => {
                          return (
                            <Col key={i}>
                              <Link
                                key={i}
                                to={{
                                  pathname:
                                    "/simulation/" + locationState.courseId,
                                }}
                                state={{
                                  type: type,
                                  title: locationState.title,
                                  courseId: locationState.courseId,
                                  num: numQuestions,
                                  penalty: penaltyScore,
                                  max: maxScore,
                                  isMulti: isMulti,
                                  duration: duration,
                                }}
                              >
                                <Button
                                  key={i}
                                  className="start-simulation-button"
                                  variant="outline-success"
                                >
                                  {type + " Question"}
                                </Button>
                              </Link>
                            </Col>
                          );
                        })
                      ) : (
                        <Alert variant="danger">Invalid Inputs</Alert>
                      )}
                    </Row>
                  </Stack>
                </Stack>
              </Col>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

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
    Alert
} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import "./StartSimulation.css"



export default function StartSimulation () {

    const simulationTypes = ["Random", "Exam"]

    const [isMulti, setIsMulti] = useState(false);

    const [numQuestions, setNumQuestions] = useState(10);
    const [penaltyScore, setPenaltyScore] = useState(-.5);
    const [maxScore, setMaxScore] = useState(30);
    const [userInput, setUserInput] = useState(1)


    const locationState = useLocation().state

    useEffect(()=>{

        userInput?console.log(userInput):console.log("x")
    },[userInput])

    return(
        <>
            <Container>
                <Card className="simulation-card">
                    <Card.Body>
                        <Stack gap={4}>
                            <h3>Simulation Set Up</h3>
                            <Col>
                                <Stack gap={2}>
                                    <Row>
                                        <div key='checkbox-ratio' className="mb-3">
                                            <Form.Switch className="multiquiz-toggle" type="switch" label="Multiple Choice Questions Only (With Grade)" onChange={()=>setIsMulti(!isMulti)}/>
                                        </div>
                                    </Row>
                                    {
                                        userInput||userInput === 0?<></>:<Alert variant="danger">Only Number Inputs Are Allowed</Alert>
                                    }
                                    <Stack gap={4}>
                                        {isMulti ?
                                            <Row>
                                                <Card>
                                                    <Card.Body>
                                                        <Stack gap={2}>
                                                            <h6>( Number of Question and Maximum Score Must Not Be Zero )</h6>
                                                            <InputGroup>
                                                                <InputGroup.Text>Number of Questions </InputGroup.Text>
                                                                <FormControl aria-label={numQuestions} placeholder={numQuestions} onChange={e=>{
                                                                    setUserInput(Number(e.target.value))
                                                                    setNumQuestions(Number(e.target.value))
                                                                }}/>
                                                            </InputGroup>
                                                            <InputGroup>
                                                                <InputGroup.Text>Penalty </InputGroup.Text>
                                                                <FormControl aria-label={penaltyScore} placeholder={penaltyScore} onChange={e=>{
                                                                    setUserInput(Number(e.target.value))
                                                                    setPenaltyScore(Number(e.target.value))
                                                                }}/>
                                                            </InputGroup>
                                                            <InputGroup>
                                                                <InputGroup.Text>Maximum Score </InputGroup.Text>
                                                                <FormControl aria-label={maxScore} placeholder={maxScore} onChange={e=>{
                                                                    setUserInput(Number(e.target.value))
                                                                    setMaxScore(Number(e.target.value))
                                                                }}/>
                                                            </InputGroup>
                                                        </Stack>
                                                    </Card.Body>
                                                </Card>
                                            </Row>
                                            :
                                            <></>
                                        }
                                        <Row className="bottom-group">
                                            {
                                                numQuestions&&maxScore?
                                                simulationTypes.map((type) => {
                                                    return (
                                                        <Col>
                                                            <Link
                                                                to={{pathname: "/simulation/" + locationState.courseId}}
                                                                state={{
                                                                    type: type,
                                                                    title: locationState.title,
                                                                    courseId: locationState.course,
                                                                    num:numQuestions,
                                                                    penalty:penaltyScore,
                                                                    max:maxScore,
                                                                    isMulti:isMulti
                                                                }}>
                                                                <Button className="btn-outline-success"
                                                                        variant="outline-success">
                                                                    {type + " Question"}
                                                                </Button>
                                                            </Link>
                                                        </Col>
                                                    )
                                                }) : (
                                                        <Alert variant="danger">Invalid Inputs</Alert>
                                                    )
                                            }
                                        </Row>
                                    </Stack>
                                </Stack>
                            </Col>
                        </Stack>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
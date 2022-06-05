import {useState} from "react";
import {Container, Card, Row, Col, Button, Image, Stack, ListGroup,Accordion} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./SimulationAccess.css";


export default function SimulationAccess() {

    const fakeSimulationResult = [
        {
        id:"A1234",
        course: "Analysis I",
        score: 30,
        date: "20/05/21",
        maxScore: 30
        },
        {
            id:"B5678",
            course: "Physics I",
            score: 18,
            date: "01/11/21",
            maxScore: 30
        },
        {
            id:"C1001",
            course: "Geometry",
            score: 25,
            date: "20/04/22",
            maxScore: 30
        },

    ]

    const fakeCourses = [
        {   id: "A0B1C2",
            course: "Analysis I",
            cfu: 10,
            professor: "Mario Rossi",
            selected: true,
            enrolled: true
        },
        {
            code: "D3E4F5",
            course: "Physics I",
            cfu: 10,
            professor: "Stefano Bianchi",
            selected:true,
            enrolled: true
        },
        {
            code: "G6H7I8",
            course: "Geometry",
            cfu: 10,
            professor: "Giuseppe Verdi",
            selected: false,
            enrolled: true
        },
    ];

    const [coursesEnrolled, setCoursesEnrolled] = useState(fakeCourses)
    const [simulationResult, setSimulationResult] = useState(fakeSimulationResult);

    return(
        <>
            <Container className="simulation-access-container">
                <h3>Simulation</h3>
                <Card>
                    <Card.Body>
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Courses Selected</Accordion.Header>
                                <Accordion.Body>
                                    <Stack gap={3}>
                                        <ListGroup varient="flush">
                                            {coursesEnrolled.map((e,i) => {
                                                if (e.selected) {
                                                    return (
                                                        <>
                                                            <ListGroup.Item varient="flush">
                                                                <Row key={i}>
                                                                    <Col className="col-3">
                                                                        <Link
                                                                            to={{
                                                                                pathname: "/course/" + e.id,
                                                                            }}
                                                                            state={{
                                                                                courseId: e.id,
                                                                                title: e.course,
                                                                            }}>
                                                                            <h5>{e.course}</h5>
                                                                        </Link>
                                                                    </Col>
                                                                    <Col className="col-3">
                                                                        <Link
                                                                            to={{ pathname: "/startsimulation/" + e.id }}
                                                                            state={{
                                                                                courseId: e.id,
                                                                                title: e.course,
                                                                            }}
                                                                        >
                                                                            <Button className="right-button">
                                                                                <Image
                                                                                    className="add-icon"
                                                                                    src={process.env.PUBLIC_URL + "/icons/SIMULATION RESULTS_WHITE.svg"}
                                                                                    width="13px"
                                                                                />
                                                                                {" Start Simulation"}
                                                                            </Button>
                                                                        </Link>
                                                                    </Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                        </>
                                                    )
                                                }
                                            })}
                                        </ListGroup>
                                    </Stack>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <Accordion>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Courses Enrolled</Accordion.Header>
                                <Accordion.Body>
                                    <Stack gap={3}>
                                        <ListGroup varient="flush">
                                            {coursesEnrolled.map((e,i) => {
                                                if (!e.selected && e.enrolled) {
                                                    return (
                                                        <>
                                                            <ListGroup.Item varient="flush" key={i}>
                                                                <Row>
                                                                    <Col className="col-3">
                                                                        <Link
                                                                            to={{
                                                                                pathname: "/course/" + e.id,
                                                                            }}
                                                                            state={{
                                                                                courseId: e.id,
                                                                                title: e.course,
                                                                            }}>
                                                                            <h5>{e.course}</h5>
                                                                        </Link>
                                                                    </Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                        </>
                                                    )
                                                }
                                            })}
                                        </ListGroup>
                                    </Stack>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <ListGroup className="simulation-access-result">
                            <h6>Simulation Results</h6>
                            {simulationResult.map((e,i)=> {
                                return (
                                    <>
                                        <ListGroup.Item varient="flush" key={i}>
                                            {
                                                <Row>
                                                    <Col>{e.course}</Col>
                                                    <Col>{e.score}</Col>
                                                    <Col>{e.date}</Col>
                                                </Row>
                                            }
                                        </ListGroup.Item>
                                    </>
                                )
                            })}
                        </ListGroup>
                    </Card.Body>
                </Card>

            </Container>
        </>
    )
}
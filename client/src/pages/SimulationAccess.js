import {useState} from "react";
import {Container, Card, Row, Col, Button, Image, Stack, ListGroup,Accordion, DropdownButton, Dropdown} from "react-bootstrap";
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
            enrolled: true
        },
        {
            code: "D3E4F5",
            course: "Physics I",
            cfu: 10,
            professor: "Stefano Bianchi",
            enrolled: true
        },
        {
            code: "G6H7I8",
            course: "Geometry",
            cfu: 10,
            professor: "Giuseppe Verdi",
            enrolled: true
        },
    ];

    const [coursesEnrolled, setCoursesEnrolled] = useState(fakeCourses);
    const [simulationResult, setSimulationResult] = useState(fakeSimulationResult);
    const [courseSelected, setCourseSelected] = useState({});
    const [courseSelectedTitle, setCourseSelectedTitle] = useState("Select Course of Simulation")
    return(
        <>
            <Container className="">
                <h3>Simulation</h3>
                <Card>
                    <Card.Body>
                        <Row className="col-xxl-12">
                            <Col>
                                {
                                    courseSelected.course? (
                                        <Link
                                            className="simulation-button"
                                            to={{
                                                pathname:
                                                    "/startsimulation/" + courseSelected.code,
                                            }}
                                            state={{
                                                courseId: courseSelected.code,
                                                title: courseSelected.course,
                                            }}
                                        >
                                            <Button>
                                                <Image
                                                    className="add-icon"
                                                    src={
                                                        process.env.PUBLIC_URL +
                                                        "/icons/SIMULATION RESULTS_WHITE.svg"
                                                    }
                                                    width="13px"
                                                />
                                                {" Start Simulation"}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                        </>
                                    )
                                }
                                {/*<Link*/}
                                {/*    to={{ pathname: "/startsimulation/" + e.id }}*/}
                                {/*    state={{*/}
                                {/*        courseId: e.id,*/}
                                {/*        title: e.course,*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <Button className="right-button">*/}
                                {/*        <Image*/}
                                {/*            className="add-icon"*/}
                                {/*            src={process.env.PUBLIC_URL + "/icons/SIMULATION RESULTS_WHITE.svg"}*/}
                                {/*            width="13px"*/}
                                {/*        />*/}
                                {/*        {" Start Simulation"}*/}
                                {/*    </Button>*/}
                                {/*</Link>*/}
                            </Col>
                            <Col>
                                <DropdownButton id="dropdown-basic-button" title={courseSelectedTitle}>
                                    {
                                        coursesEnrolled.map((e,i) => {
                                            if(e.enrolled) {
                                                return (
                                                    <>
                                                        <Dropdown.Item key={i} as="button" onClick={()=> {
                                                            setCourseSelectedTitle(e.course);
                                                            setCourseSelected(e);
                                                        }}>{e.course}</Dropdown.Item>
                                                    </>
                                                )
                                            }
                                        })
                                    }
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row>
                            <ListGroup className="simulation-access-result">
                                <h6>Simulation Results</h6>
                                {simulationResult.map((e,i)=> {
                                    return (
                                        <>
                                            <ListGroup.Item varient="flush">
                                                {
                                                    <Row key={i}>
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
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
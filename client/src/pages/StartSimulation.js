import {Card, Container, Form, Row, Col, Button, Stack} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {useState} from "react";
import "./StartSimulation.css"



export default function StartSimulation () {

    const simulationTypes = ["Random", "Exam"]

    const [isMulti, setIsMulti] = useState(false);


    const location = useLocation()

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
                                    <Stack gap={4}>
                                        {isMulti ?
                                            <Row>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Text>
                                                            Number of Questions 10
                                                        </Card.Text>
                                                        <Card.Text>
                                                            Penalty -0.5
                                                        </Card.Text>
                                                        <Card.Text>
                                                            Maximum Score 30
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Row>
                                            :
                                            <></>
                                        }
                                        <Row className="bottom-group">
                                            {simulationTypes.map((type) => {
                                                return(
                                                    <Col>
                                                        <Link to={{pathname:"/simulation/" + type.toLowerCase()}} state={{type:type, title:location.state.title}}>
                                                            <Button className="btn-outline-success" variant="outline-success">
                                                                {type + " Question"}
                                                            </Button>
                                                        </Link>
                                                    </Col>
                                                )
                                            })}
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
import { useContext, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Image,
  Stack,
  ListGroup,
  Accordion,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SimulationAccess.css";
import { GlobalStateContext } from "../GlobalStateProvider";

export default function SimulationAccess() {
  const fakeSimulationResult = [
    {
      id: "A1234",
      course: "Analysis I",
      score: 30,
      date: "20/05/21",
      maxScore: 30,
    },
    {
      id: "B5678",
      course: "Physics I",
      score: 18,
      date: "01/11/21",
      maxScore: 30,
    },
    {
      id: "C1001",
      course: "Geometry",
      score: 25,
      date: "20/04/22",
      maxScore: 30,
    },
  ];

  const fakeCourses = [
    {
      code: "A0B1C2",
      course: "Analysis I",
      cfu: 10,
      professor: "Mario Rossi",
      enrolled: true,
    },
    {
      code: "D3E4F5",
      course: "Physics I",
      cfu: 10,
      professor: "Stefano Bianchi",
      enrolled: true,
    },
    {
      code: "G6H7I8",
      course: "Geometry",
      cfu: 10,
      professor: "Giuseppe Verdi",
      enrolled: true,
    },
  ];

  const { mySimulationResult, userCourses } = useContext(GlobalStateContext);
  const [coursesEnrolled, setCoursesEnrolled] = useState(userCourses);
  const [simulationResult, setSimulationResult] = useState(mySimulationResult);
  const [courseSelected, setCourseSelected] = useState({});
  const [courseSelectedTitle, setCourseSelectedTitle] = useState(
    "Select Course of Simulation"
  );

  console.log(mySimulationResult, userCourses);
  return (
    <>
      <Container className="">
        <h3>Simulation</h3>
        <Card>
          <Card.Body>
            <Row className="col-xxl-12">
              <Col>
                {courseSelected.course ? (
                  <Link
                    className="simulation-button"
                    to={{
                      pathname: "/startsimulation/" + courseSelected._id,
                    }}
                    state={{
                      courseId: courseSelected._id,
                      title: courseSelected.name,
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
                  <></>
                )}
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
                <DropdownButton
                  id="dropdown-basic-button"
                  title={courseSelectedTitle}
                >
                  {coursesEnrolled.map((e, i) => {
                    return (
                      <>
                        <Dropdown.Item
                          key={"enrolled" + i}
                          as="button"
                          onClick={() => {
                            setCourseSelectedTitle(e.name);
                            setCourseSelected(e);
                          }}
                        >
                          {e.name}
                        </Dropdown.Item>
                      </>
                    );
                  })}
                </DropdownButton>
              </Col>
            </Row>
            <Row>
              <ListGroup className="simulation-access-result">
                <h6>Simulation Results</h6>
                {simulationResult.map((e, i) => {
                  return (
                    <>
                      <ListGroup.Item varient="flush">
                        {
                          <Row key={"result" + i}>
                            <Col>{e["course_id"]}</Col>
                            <Col>{e.results[0]}</Col>
                            {/*<Col>*/}
                            {/*  {*/}
                            {/*    e.course["years_active"][*/}
                            {/*      e.course["years_active"].length - 1*/}
                            {/*    ]*/}
                            {/*  }*/}
                            {/*</Col>*/}
                          </Row>
                        }
                      </ListGroup.Item>
                    </>
                  );
                })}
              </ListGroup>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}


import {useContext, useEffect, useState} from "react";

import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Image,
  ListGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SimulationAccess.css";
import { GlobalStateContext } from "../GlobalStateProvider";
import API from "../api/API";

export default function SimulationAccess() {


  const { userID } = useContext(GlobalStateContext);

  const [coursesEnrolled, setCoursesEnrolled] = useState([]);
  const [simulationResult, setSimulationResult] = useState([]);
  const [courseSelected, setCourseSelected] = useState({});
  const [courseSelectedTitle, setCourseSelectedTitle] = useState(
    "Select Course of Simulation"
  );

  useEffect(()=>{
    API.getMySimulationResult(userID).then((result) => {
      setSimulationResult(result);
    });
    API.getMyCourses(userID).then((courses)=> setCoursesEnrolled(courses))
  }, [])

  return (
    <>
      <Container className="">
        <h3>Simulation</h3>
        <Card>
          <Card.Body>
            <Row className="col-xxl-12">
              <Col>
                {courseSelected.name ? (
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
              </Col>
              <Col>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={courseSelectedTitle}
                >
                  {coursesEnrolled.map((e, i) => {
                    return (
                        <Dropdown.Item
                          key={"enrolled" + i}
                          as="button"
                          onClick={() => {
                            setCourseSelectedTitle(e._id + " " + e.name);
                            setCourseSelected(e);
                          }}
                        >
                          {e._id + " " +  e.name}
                        </Dropdown.Item>
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
                    <ListGroup.Item varient="flush" key={"result" + i}>
                      {
                        <Row>
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

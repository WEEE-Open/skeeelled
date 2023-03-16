import { Row, Col, Card, Image, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import "./UserSettings.css";
import { List } from "../base/";
import {GlobalStateContext} from "../GlobalStateProvider";

function UserSettings() {
  const fake = [
    [<Form.Check />, "Analisys I"],
    [<Form.Check />, "Physics I"],
    [<Form.Check />, "Geometry"],
  ];
  const {
    userInfo
  } = useContext(GlobalStateContext)

  const [courses, setCourses] = useState(fake);
  const [user, setUser] = useState(userInfo)

  useEffect(()=>{
    setUser(userInfo)
  },[userInfo])


  return (
    <Card body>
      <Row lg={12} className="py-0 header">
        <Col xs={2}>
          <Image src={process.env.PUBLIC_URL + "/icons/PERSON.svg"} />
        </Col>
        <Col>
          <h3> { user?.name + " " + user?.surname } </h3>
          <h4> { } </h4>
          <Form.Control placeholder="Change nickname" />
          <Form.Check label="Public profile" />
        </Col>
      </Row>
      <Row>
        <Col>
          <List rows={courses} title={"Enrolled in"} scope={"default"} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to="/courses">
            <Button>Add new course</Button>
          </Link>
          <Button className="saveButton">Save</Button>
        </Col>
      </Row>
    </Card>
  );
}

export default UserSettings;

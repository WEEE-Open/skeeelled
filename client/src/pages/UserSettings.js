import { Row, Col, Card, Image, Form, Button } from "react-bootstrap";
import "./Profile.css";
import { ListGroup } from "../base/";

function UserSettings() {
  return (
    <Card body>
      <Row lg={12} className="py-0 header">
        <Col xs={2}>
          <Image src={process.env.PUBLIC_URL + "icons/PERSON.svg"} />
        </Col>
        <Col>
          <h3>Name Surname</h3>
          <h4>@Nickname</h4>
          <Form.Control placeholder="Change nickname"/>
          <Form.Check label="Public profile"/>
        </Col>
      </Row>
      <hr/>
      <Row>
          <Col>
            <h4>Enrolled in</h4>
            <Form.Check label="Course 1"/>
            <Form.Check label="Course 2"/>
            <Form.Check label="Course 3"/>
          </Col>
      </Row>
      <hr/>
      <Row>
          <Col>
            <Button>Add new course</Button>
            <Button style={{float: 'right'}}>Save</Button>
          </Col>
      </Row>
    </Card>
  );
}

export default UserSettings;
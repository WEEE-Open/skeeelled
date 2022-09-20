import { Row, Col, Card, Image } from "react-bootstrap";
import { useState } from "react";
// import "./Profile.css";
import "./stylesheet/Profile.css"; // scss file access
import { ListGroup, SearchBar } from "../base/";

function Profile() {
  const fake = [
    {
      scope: "default",
      title: "My questions",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "default",
      title: "My answers",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "default",
      title: "My simulation results",
      rows: [
        ["aaa", "bbb", "ccc"],
        ["aaa", "bbb", "ccc"],
        ["aaa", "bbb", "ccc"],
      ],
    },
  ];

  const [tests, setTests] = useState(fake);

  return (
    <Card body>
      <Row lg={12} className="py-0 header">
        <Col xs={2}>
          <Image src={process.env.PUBLIC_URL + "/icons/PERSON.svg"}  className="user-profile-image"/>
        </Col>
        <Col className="user-name-nickname">
          <h3 className="user-name-surname">Name Surname</h3>
          <h4 className="user-nickname">@nickname</h4>
        </Col>
      </Row>
      <div className="user-profile">
        <ListGroup lists={tests} cols={2} rounded dotted />
      </div>
    </Card>
  );
}

export default Profile;

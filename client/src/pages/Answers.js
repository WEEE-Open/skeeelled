import { useState } from "react";
import {
  Button,
  Container,
  Card,
  Row,
  Col,
  Pagination,
  FloatingLabel,
  Collapse,
  Form,
} from "react-bootstrap";
import { List } from "../base";
import "./Answers.css";

function Answers(props) {
  const fakeAnswers = [
    {
      id: 1,
      answer: "Cras justo odio dapibus ac facilisis in",
      author: "Donato",
      createdat: "15:20 12/01/2021",
      like: 5,
      dislike: 2,
    },
    {
      id: 2,
      answer: "Morbi leo risus porta ac consectetur ac",
      author: "Jim",
      createdat: "17:30 13/02/2021",
      like: 5,
      dislike: 7,
    },
    {
      id: 3,
      answer: "Vestibulum at eros",
      author: "Derek",
      createdat: "19:40 14/03/2021",
      like: 9,
      dislike: 1,
    },
  ];

  const [answers, setAnswers] = useState(fakeAnswers);
  const [adviceIsHidden, setAdviceIsHidden] = useState(!props.showhints);
  const [answersAreHidden, setAnswersAreHidden] = useState(
    !props.showdiscussion
  );

  return (
    <Container className="container">
      <Card body>
        <Row lg={12} className="header">
          <Col>
            <h5>
              Dolor sit amet consectetur adipiscing elit pellentesque habitant ?
              {adviceIsHidden ? (
                <Button
                  id={"hint-button"}
                  className="btn-sm"
                  onClick={() => {
                    setAdviceIsHidden(!adviceIsHidden);
                  }}
                >
                  Show hint
                </Button>
              ) : (
                <Button
                  id={"hint-button"}
                  className="btn-sm"
                  onClick={() => {
                    setAdviceIsHidden(!adviceIsHidden);
                  }}
                >
                  Hide hint
                </Button>
              )}
            </h5>
            {!adviceIsHidden && (
              <h6>
                habitant morbi tristique senectus et netus. Lorem sed risus
                ultricies tristique nulla aliquet enim. Blandit cursus risus at
                ultrices mi tempus.
              </h6>
            )}
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Button
              onClick={() => setAnswersAreHidden((value) => !value)}
              aria-controls="example-collapse-text"
              aria-expanded={!answersAreHidden}
              className={`w-100 ${
                answersAreHidden ? "btn-success" : "btn-warning"
              }`}
            >
              {answersAreHidden ? "Show answers" : "Hide answers"}
            </Button>
          </Col>
        </Row>
        <Collapse className="collapse" in={!answersAreHidden}>
          <Row>
            <Col lg="12">
              <Form.Group controlId="formGridState">
                <Form.Control placeholder="Search" />
              </Form.Group>
            </Col>
            <Col lg="12">
              <List scope="answers" title="Physics I" rows={answers} />
            </Col>
            <Col lg="12" sm="12" md="12">
              <Pagination>
                {[
                  <Pagination.Item key={1} active>
                    {1}
                  </Pagination.Item>,
                  <Pagination.Item key={2} active={false}>
                    {2}
                  </Pagination.Item>,
                  <Pagination.Item key={3} active={false}>
                    {3}
                  </Pagination.Item>,
                  <Pagination.Item key={4} active={false}>
                    {4}
                  </Pagination.Item>,
                  <Pagination.Item key={5} active={false}>
                    {5}
                  </Pagination.Item>,
                  <Pagination.Item key={6} active={false}>
                    {6}
                  </Pagination.Item>,
                ]}
              </Pagination>
            </Col>
          </Row>
        </Collapse>
      </Card>
    </Container>
  );
}

export default Answers;

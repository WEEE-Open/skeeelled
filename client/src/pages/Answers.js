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
import { List, QuestionPreview, Discussion, TextInput } from "../base";
import "./Answers.css";

const fakeQuestion = {
  course_code: "01UROLM",
  course_name: "Mathematical methods for Computer Science",
  title: "Theory of distributions",
  author: "Sahircan Sürmeli",
  tags: ["distributions", "functionals", "test functions"],
  text: "Find all distributions $T \\in D^\\prime$ such that $T^\\prime = \\delta_0 + \\delta_2 - 2\\delta^\\prime_1$.",
  date: new Date("April 23, 2022"),
  advice: "You have to integrate something."
};

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

function Answers(props) {
  const [showDiscussion, setShowDiscussion] = useState(props.showdiscussion || false);
  const [answers, setAnswers] = useState(fakeAnswers);
  const [question, setQuestion] = useState(fakeQuestion);

  console.log(props);

  return (
    <Container className="container">
      <Row lg={12} className="header">
        <Col>
          {<QuestionPreview question={question} />}
        </Col>
      </Row>

      <Row className="header">
        <Col>
          <TextInput childProps={{
            textArea: {
              placeholder: "Leave a comment"
            }
          }} />
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <Button
            onClick={() => setShowDiscussion((value) => !value)}
            aria-controls="example-collapse-text"
            aria-expanded={showDiscussion}
            className={`w-100 ${showDiscussion ? "btn-warning" : "btn-success"
              }`}
          >
            {showDiscussion ? "Hide discussion" : "Show discusssion"}
          </Button>
        </Col>
      </Row>

      <Discussion
        show={showDiscussion}
        title={question.title}
        answers={answers}
        no_pages={5}
        current_page={1}
      />
    </Container>
  );
}

export default Answers;

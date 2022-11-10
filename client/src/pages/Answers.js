import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { QuestionPreview, Discussion, TextInput } from "../base";
import "./stylesheet/Answer.css";

const fakeQuestion = {
  course_code: "01UROLM",
  course_name: "Mathematical methods for Computer Science",
  title: "Theory of distributions",
  author: "Sahircan Sürmeli",
  tags: ["distributions", "functionals", "test functions"],
  text: "Find all distributions $T \\in D^\\prime$ such that $T^\\prime = \\delta_0 + \\delta_2 - 2\\delta^\\prime_1$.",
  date: new Date("April 23, 2022"),
  advice: "You have to integrate something.",
};

function Answers(props) {
  const [question, setQuestion] = useState(fakeQuestion);

  return (
    <Container className="answer-container">
      <Row lg={12} className="header">
        <Col>
          <QuestionPreview question={question} showhints={props.showhints} />
        </Col>
      </Row>

      <Row className="text-input">
        <Col>
          <TextInput
            childProps={{
              textArea: {
                placeholder: "Leave a comment",
              },
            }}
          />
        </Col>
      </Row>

      <Discussion showdiscussion={props.showdiscussion} />
    </Container>
  );
}

export default Answers;

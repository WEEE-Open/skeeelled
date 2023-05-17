import { useEffect, useState } from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import { QuestionPreview, Discussion, TextInput } from "../base";
import "./stylesheet/Answer.css";
import API from "../api/API";
import {useLocation, useParams} from "react-router-dom";

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
  const locationState = useLocation().state;
  const {questionid} = useParams();
    const [question, setQuestion] = useState([]);
    const [discussions, setDiscussions] = useState([]);


  // get the discussions of the question
  useEffect(() => {
    API.getDiscussions(questionid).then((discussions) =>
      setDiscussions(discussions)
    );
    API.getSingleQuestion(questionid).then((question)=> {
      setQuestion([question])
    })
      // API.getQuestions(locationState.courseId).then((questions) =>
      //     setQuestion(questions)
      // );
  }, []);


  return (
    <Container className="answer-container">
      <Row lg={12} className="header">
        <Col>
            {
             question && question.length > 0 && question[0]._id  ? <QuestionPreview question={question} showhints={props.showhints} />:<></>
            }
        </Col>
          <Button className="answer-button">Answer</Button>
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
        <Row>
            <Discussion
                showdiscussion={props.showdiscussion}
                discussions={discussions}
            />
        </Row>
    </Container>
  );
}

export default Answers;

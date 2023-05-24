import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { QuestionPreview, Discussion, TextInput} from "../base";
import "./stylesheet/Answer.css";
import API from "../api/API";
import CommentInput from "../base/CommentInput";
import { useLocation, useParams } from "react-router-dom";
import { GlobalStateContext } from "../GlobalStateProvider";

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
  const { questionid } = useParams();
  const [question, setQuestion] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const { userID } = useContext(GlobalStateContext);

  // get the discussions of the question
  useEffect(() => {
    API.getQuestion(questionid).then((question) => {
      setQuestion(question);
    });

    API.getDiscussions(questionid).then((discussions) =>
      setDiscussions(discussions)
    );
  }, [questionid, locationState]);

  return (
    <Container className="answer-container">
      <Row lg={12} className="header">
        <Col>
          <QuestionPreview question={question} showhints={props.showhints} />
        </Col>
      </Row>

      <Row className="text-input">
        <Col>
          <CommentInput
            childProps={{
              textArea: {
                placeholder: "Leave a comment",
              }
            }}
            questionID={questionid}
            userID={userID}
          />
        </Col>
      </Row>

      <Discussion
        showdiscussion={props.showdiscussion}
        discussions={discussions}
      />
    </Container>
  );
}

export default Answers;

import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function DebugPaths() {
  const style = { padding: "5px" };
  return (
    <Alert dismissible>
      <b>Dev only: </b>
      <Link style={style} to="/login">
        Login
      </Link>
      <Link style={style} to="/">
        Home
      </Link>
      <Link style={style} to="/profile">
        Profile
      </Link>
      <Link style={style} to="/courses">
        Courses
      </Link>
      <Link style={style} to="/course/ABCDEF">
        Course
      </Link>
      <Link style={style} to="/question/QUESTID">
        Question
      </Link>
      <Link style={style} to="/myquestions">
        MyQuestions
      </Link>
      <Link style={style} to="/discussion/QUESTID">
        Discussion
      </Link>
      <Link style={style} to="/simulation">
        Simulation
      </Link>
      <Link style={style} to="/todel">
        Exam
      </Link>
    </Alert>
  );
}

export default DebugPaths;

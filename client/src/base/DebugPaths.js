import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function DebugPaths() {
  const style = { padding: "5px" };
  const [show, setShow] = useState(true);
  return (
    <Alert show={show} onClose={() => setShow(false)} dismissible>
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
      <Link
        style={style}
        to="/course/ABCDEF"
        state={{ courseId: "courseId", title: "Course Name" }}
      >
        Course
      </Link>
      <Link style={style} to="/question/QUESTID">
        Question
      </Link>
      <Link style={style} to="/myquestions">
        MyQuestions
      </Link>
      <Link style={style} to="/mycomments">
        MyComments
      </Link>
      <Link style={style} to="/myreplies">
        MyReplies
      </Link>
      <Link style={style} to="/discussion/QUESTID">
        Discussion
      </Link>
      <Link style={style} to="/startsimulation/">
        Simulation
      </Link>
      <Link style={style} to="/settings">
        UserSettings
      </Link>
      <Link style={style} to="/todel">
        Exam
      </Link>
      <Link style={style} to="/python-editor">
        Python Editor
      </Link>
    </Alert>
  );
}

export default DebugPaths;

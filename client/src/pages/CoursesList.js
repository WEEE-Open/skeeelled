import { Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState /* , useEffect */ } from "react";

import { Recent, List, SearchBar, MyPagination } from "../base/";
import "./stylesheet/CoursesList.css";
import Suggestion from "../base/Suggestion";
import API from "../api/API";
import CourseObj from "../entities/CourseObj";
import { GlobalStateContext } from "../GlobalStateProvider";

/** Mock questions **/

const fakeQuestions = [
  {
    id: 1,
    question: "What is a vector?",
    author: "Donato",
    createdat: "15:20 12/01/2021",
    tags: ["vectors"],
    excerpt: "Cras justo odio...",
  },
  {
    id: 2,
    question: "Who is Maxwell?",
    author: "Jim",
    createdat: "17:30 13/02/2021",
    tags: ["physics"],
    excerpt: "Cras justo odio...",
  },
  {
    id: 3,
    question: "How many meters per second?",
    author: "Derek",
    createdat: "19:40 14/03/2021",
    tags: ["physics", "kinematic"],
    excerpt: "Cras justo odio...",
  },
];

function CoursesList() {
  const { userID } = useContext(GlobalStateContext);

  const [courses, setAllCourses] = useState([]);
  const [myCourses, setUserCourses] = useState([]);

  const [suggestions, setSuggestions] = useState(fakeQuestions /*[]*/);
  const suggestionType = ["Latest", "Hottest"];
  const coursesType = ["My Courses", "All Courses"];

  useEffect(() => {
    if (!userID) return;
    API.getMyCourses(userID).then((myCourses) => setUserCourses(myCourses));
  }, [userID]);

  useEffect(() => {
    API.getCourses().then((courses) => setAllCourses(courses));
  }, []);

  return (
    <Container>
      <Row lg={12} className="py-0 header">
        <h3 className="courses-title">Courses</h3>
      </Row>
      <Row>
        <SearchBar apiCall={{ scope: "courses" }}></SearchBar>
      </Row>
      <Row className="courses-body">
        <Link
          className="list-attributes"
          to={{
            pathname:
              "/listfullpage/" + "My Courses".replace(/\s/g, "").toLowerCase(),
          }}
          state={{ scope: "courses", title: "My Courses", rows: myCourses }}
        >
          <List scope="courses" title={"My Courses"} rows={myCourses} rounded />
        </Link>
        <Link
          className="list-attributes"
          to={{
            pathname:
              "/listfullpage/" + "All Courses".replace(/\s/g, "").toLowerCase(),
          }}
          state={{ scope: "courses", title: "All Courses", rows: courses }}
        >
          <List scope="courses" title={"All Courses"} rows={courses} rounded />
        </Link>
      </Row>
    </Container>
  );
}

export default CoursesList;

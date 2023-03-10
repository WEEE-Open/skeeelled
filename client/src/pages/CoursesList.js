import { Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState /* , useEffect */ } from "react";

import { Recent, List, SearchBar, MyPagination } from "../base/";
import "./stylesheet/CoursesList.css";
import Suggestion from "../base/Suggestion";
import API from "../api/API";
import CourseObj from "../entities/CourseObj";

function CoursesList() {
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

  // const AllCourses = API.getCourses()
  //   .then((courses) => {
  //     // console.log(a);
  //     setCourses(courses);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  const [courses, setCourses] = useState([]);
  // const [myCourses, setMyCourses] = useState([]);
  const [suggestions, setSuggestions] = useState(fakeQuestions /*[]*/);
  const suggestionType = ["Latest", "Hottest"];
  const coursesType = ["My Courses", "All Courses"];

  /**Courses and questions related**/
  //*
	// courses
	useEffect(()=> {
		API.getCourses()
			.then(courses => setCourses(courses))
			.catch(err => console.log(err));
	}, []);

	// myCourses
	// useEffect(() => {
	// 	API.getMyCourses()
	// 		.then(myCourses => setMyCourses(myCourses))
	// 		.catch(err => console.log(err));
	// }, []);
	//*/

  // useEffect(() => {
  //     const getCourses = async () => {
  //         const courses = await API.getAllCourses();
  //         setCourses(courses);
  //     }
  //     getCourses();
  // },[]);

  return (
    <Container>
      <Row lg={12} className="py-0 header">
        <h3 className="courses-title">Courses</h3>
      </Row>
      <Row>
        <SearchBar />
      </Row>
      <Row className="courses-body">
        {coursesType.map((type, i) => {
          return (
            <Link
              key={i}
              className="list-attributes"
              to={{
                pathname:
                  "/listfullpage/" + type.replace(/\s/g, "").toLowerCase(),
              }}
              state={{ scope: "courses", title: type, rows: courses }}
            >
              <List
                key={i}
                scope="courses"
                title={type}
                rows={courses}
                rounded
              />
            </Link>
          );
        })}
      </Row>
      <MyPagination />
    </Container>
  );
}

export default CoursesList;

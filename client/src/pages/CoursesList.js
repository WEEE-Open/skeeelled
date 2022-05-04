import {Row, Col, Card, Pagination, Form, Button, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";
import { useState /* , useEffect */ } from "react";
import { Recent, List, SearchBar } from "../base/";
import Suggestion from "../base/Suggestion";
// import API from "../api/API";

const PaginationRow = () => {
  let [active, setActive] = useState(1)
  let items = [];
  for( let num = 1; num <= 5; num++) {
    items.push(
        <Pagination.Item key={num} active={num === active} onClick={()=>{
          setActive(active = num)
        }}>
          {num}
        </Pagination.Item>
    )
  }

  return (
      <Pagination>
        <Pagination.First />
        {items}
        <Pagination.Last />
      </Pagination>
  )
}

function CoursesList() {
  /** Mock courses and questions **/
  const fakeCourses = [
    { code: "A0B1C2",
      course: "Analysis 1",
      cfu: 10,
      professor: "Mario Rossi",
    },
    {
      code: "D3E4F5",
      course: "Physics 1",
      cfu: 10,
      professor: "Stefano Bianchi",
    },
    {
      code: "G6H7I8",
      course: "Geometry",
      cfu: 10,
      professor: "Giuseppe Verdi",
    },
  ];

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

  const [courses, setCourses] = useState(fakeCourses /*[]*/);
  const [myCourses, setMyCourses] = useState([]);
  const [suggestions, setSuggestions] = useState(fakeQuestions /*[]*/);
  const suggestionType = ["Latest", "Hottest"];
  const coursesType = ["My Courses", "All Courses"]


  /**Courses and questions related**/
  /*
	// courses
	useEffect(()=> {
		API.getCourses()
			.then(courses => setCourses(courses))
			.catch(err => console.log(err));
	}, []);

	// myCourses
	useEffect(() => {
		API.getMyCourses()
			.then(myCourses => setMyCourses(myCourses))
			.catch(err => console.log(err));
	}, []);
	*/

  // useEffect(() => {
  //     const getCourses = async () => {
  //         const courses = await API.getAllCourses();
  //         setCourses(courses);
  //     }
  //     getCourses();
  // },[]);

  return (
    <Row>
      <Col>
        <Card body>
          <Row lg={12} className="py-0 header">
              <h3>Courses</h3>
          </Row>
          <Row>
            <SearchBar />
          </Row>
          {coursesType.map(type => {
            return (
                <Link className="list-attributes" to={{pathname:"/listfullpage/" + type.toLowerCase()}} state={{ scope: "courses", title: type, rows: courses }}>
                  <List scope="courses" title={type} rows={courses} />
                </Link>
            )
          })}
          <PaginationRow />
        </Card>
      </Col>
        <Col className="d-none d-md-inline-block col-md-4">
          <Stack gap={4}>
            {suggestionType.map(type => {
              return (
                  <Row>
                    <Suggestion
                        scope={"suggestion"}
                        title={ type + " Questions"}
                        rows={suggestions}
                    />
                  </Row>
              )
            })}
          </Stack>
        </Col>
    </Row>
  );
}

export default CoursesList;

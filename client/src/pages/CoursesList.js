import {Table, Pagination, Row, Col, Card} from "react-bootstrap";
import {useEffect, useState/* , useEffect */} from "react";
import {Link} from "react-router-dom";
import {Recent} from "../base/"; //da index
import {  } from "../base";
// import API from "../api/API";

function PaginationRow() {
	let active = 1;
	let items = [];
	for (let number=1;number<=5;number++) {
		items.push(
			<Pagination.Item key={number} active={number===active} activeLabel="">
				{number}
			</Pagination.Item>,
		);
	}

	return(
		<Pagination>
			<Pagination.First/>
			{items}
			<Pagination.Last/>
		</Pagination>
	);
}

function CoursesListRow({course}) {
	return(
		<tr>
			<td width="1%">{course.code}</td>
			<td>
				<Link to={"/course/"+course.code}>{course.name}</Link>
			</td>
			<td>{course.prof}</td>
			<td width="1%">({course.cfu})</td>
		</tr>
	);
}

function CoursesList() {

	/** Mock courses **/
	const fakeCourses = [
		{code:"A0B1C2", name:"Analysis 1", cfu:10, prof:"Mario Rossi"},
		{code:"D3E4F5", name:"Physics 1", cfu:10, prof:"Stefano Bianchi"},
		{code:"G6H7I8", name:"Geometry", cfu:10, prof:"Giuseppe Verdi"},
	];

	const [courses,setCourses] = useState(fakeCourses/*[]*/);
	const [myCourses, setMyCourses] = useState([]);

	/**Courses related**/
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



	// useEffect(() => {
	//     const getCourses = async () => {
	//         const courses = await API.getAllCourses();
	//         setCourses(courses);
	//     }
	//     getCourses();
	// },[]);


	return(<Row>
		<Col>
			<Card body>
				<h1>Available courses</h1>
				<Table striped className="my-5">
					<tbody>
						{courses.map((c,i) => <CoursesListRow course={c} key={i}/>)}
					</tbody>
				</Table>
				{/* <Table striped columns={[]} rows={courses.map(row => [row.code,<Link to='/'>{row.name}</Link>,row.prof,"("+row.cfu+")"])}/> */}
				<PaginationRow/>
			</Card>
		</Col>
		<Col className="d-none d-md-block col-md-4">
			<Recent/>
		</Col>
	</Row>);
}

export default CoursesList;
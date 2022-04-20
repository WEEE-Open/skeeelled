import {Row, Col, Card, Pagination, Form} from "react-bootstrap";
import {} from "react-router-dom";
import {useState/* , useEffect */} from "react";
import {Recent, List, SearchBar} from "../base/";
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

function CoursesList() {

	/** Mock courses **/
	const fakeCourses = [
		{code:"A0B1C2", course:"Analysis 1", cfu:10, professor:"Mario Rossi"},
		{code:"D3E4F5", course:"Physics 1", cfu:10, professor:"Stefano Bianchi"},
		{code:"G6H7I8", course:"Geometry", cfu:10, professor:"Giuseppe Verdi"},
	];

	const [courses,setCourses] = useState(fakeCourses/*[]*/);
	const [myCourses, setMyCourses] = useState([]);

	/**Courses related**/
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


	return(<Row>
		<Col>
			<Card body>
				<Row lg={12} className="py-0 header">
					<Col>
						<h3>Courses</h3>
					</Col>
					<Col>
						<SearchBar/>
					</Col>
				</Row>
				<List scope="courses" title="All courses" rows={courses}/>
				<List scope="courses" title="My courses" rows={courses}/>
				<PaginationRow/>
			</Card>
		</Col>
		<Col className="d-none d-md-block col-md-4">
			<Recent/>
		</Col>
	</Row>);
}

export default CoursesList;
import {Table, Pagination, Form, FormControl} from 'react-bootstrap';
import {useState/* , useEffect */} from 'react';
import {Link} from 'react-router-dom';

// import {iconAdmin, iconMeeting} from '../icons.js'
// import API from '../API';

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
            <td style={{backgroundColor:course.color}}></td>
            <td>
                <Link to={"/course/"+course.code}>{course.name}</Link>
            </td>
            <td>{course.cfu}</td>
            <td>{course.code}</td>
        </tr>
    );
}

function CoursesList() {

    /** Mock courses **/
    const fakeCourses = [
        {code:"A0B1C2", name:"Analysis 1", cfu:10, color:"#29f"},
        {code:"D3E4F5", name:"Physics 1", cfu:10, color:"#0f5"},
        {code:"G6H7I8", name:"Geometry", cfu:10, color:"#fb6"},
    ];

    const [courses,setCourses] = useState(fakeCourses/*[]*/);

    // useEffect(() => {
    //     const getCourses = async () => {
    //         const courses = await API.getAllCourses();
    //         setCourses(courses);
    //     }
    //     getCourses();
    // },[]);

    return(<>
        <h1>Available courses</h1>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th colSpan="2">Name</th>
                    <th>CFU</th>
                    <th>Code</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((c,i) => <CoursesListRow course={c} key={i}/>)}
            </tbody>
        </Table>
        <PaginationRow/>
        <Form inline>
          <FormControl type="text" placeholder="Search"/>
        </Form>
    </>);
}

export default CoursesList;
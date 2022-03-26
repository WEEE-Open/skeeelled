import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";

function DebugPaths() {
    return(
        <Table striped>
            <tbody>
                <th>Dev only</th>
                <tr><Link to="/profile">Profile</Link></tr>
                <tr><Link to="/courses">Courses</Link></tr>
                <tr><Link to="/course/ABCDEF">Course</Link></tr>
                <tr><Link to="/question/QUESTID">Question</Link></tr>
                <tr><Link to="/discussion/QUESTID">Discussion</Link></tr>
                <tr><Link to="/simulation">Simulation</Link></tr>
                <tr><Link to="/todel">Exam</Link></tr>
            </tbody>
        </Table>
    );
}

export default DebugPaths;
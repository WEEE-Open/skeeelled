import {Alert, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

function DebugPaths() {
    return(
        <Alert>
            <b>Dev only: </b>
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/profile"><Button>Profile</Button></Link>
            <Link to="/courses"><Button>Courses</Button></Link>
            <Link to="/course/ABCDEF"><Button>Course</Button></Link>
            <Link to="/question/QUESTID"><Button>Question</Button></Link>
            <Link to="/myquestions"><Button>MyQuestions</Button></Link>
            <Link to="/discussion/QUESTID"><Button>Discussion</Button></Link>
            <Link to="/simulation"><Button>Simulation</Button></Link>
            <Link to="/todel"><Button>Exam</Button></Link>
        </Alert>
    );
}

export default DebugPaths;
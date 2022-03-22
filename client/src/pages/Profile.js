import {Table} from "../base";
import {Button, Container, Row, Col, Card, ListGroup, InputGroup, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./Profile.css";
import ListEntry from "../base/ListEntry";

function Profile() {
	return(
		<Container>
			<ListEntry/>
			<Card body>
				<Row lg={12} className="header">
					<Col>
						<h3>Hi, Name Surname!</h3>
					</Col>
					<Col>
						<Form.Control onChange={() => {}} type="text" placeholder="Search courses" className="mx-auto"/>
						<Link to="/courses"><Button>View All</Button></Link>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<div className="innerHeader">
							<h6>New questions in courses I'm enrolled in</h6>							
						</div>
					</Col>
					<Col lg='12'>
						<ListGroup>
							<ListGroup.Item>Cras justo odio</ListGroup.Item>
							<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
							<ListGroup.Item>Morbi leo risus</ListGroup.Item>
							<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
							<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						</ListGroup>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<div className="innerHeader">
							<h6>My Questions</h6>
							<Button id='button-addon2'>View All</Button>
						</div>
					</Col>
					<Col lg='12'>
						<ListGroup>
							<ListGroup.Item>Cras justo odio</ListGroup.Item>
							<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
							<ListGroup.Item>Morbi leo risus</ListGroup.Item>
							<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
							<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						</ListGroup>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<div className="innerHeader">
							<h6>My Answers</h6>
							<Button id='button-addon2'>View All</Button>
						</div>
					</Col>
					<Col lg='12'>
						<ListGroup>
							<ListGroup.Item>Cras justo odio</ListGroup.Item>
							<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
							<ListGroup.Item>Morbi leo risus</ListGroup.Item>
							<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
							<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						</ListGroup>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<div className="innerHeader">
							<h6>My Courses</h6>
							<Button id='button-addon2'>View All</Button>
						</div>
					</Col>
					<Col lg='12'>
						<ListGroup>
							<ListGroup.Item>Data Management</ListGroup.Item>
							<ListGroup.Item>Data Science Lab</ListGroup.Item>
							<ListGroup.Item>Statistical Methods</ListGroup.Item>
							<ListGroup.Item>Decision Making</ListGroup.Item>
						</ListGroup>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<div className="innerHeader">
							<h6>My Results</h6>
							<Button id='button-addon2'>View All</Button>
						</div>
					</Col>
					<Col lg='12'>
						<ListGroup>
							<ListGroup.Item>Data Management</ListGroup.Item>
							<ListGroup.Item>Data Science Lab</ListGroup.Item>
							<ListGroup.Item>Statistical Methods</ListGroup.Item>
							<ListGroup.Item>Decision Making</ListGroup.Item>
						</ListGroup>
					</Col>
				</Row>
			</Card>
		</Container>
	);
}

export default Profile;

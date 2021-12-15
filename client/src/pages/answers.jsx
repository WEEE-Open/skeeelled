import { useState } from "react";
import { Table } from "../base";
const styles = {container:""/*{header:"padding-bottom:40px;",pagination:"justify-content:center;",collapse:"margin-top:10px;"}*/}; //toDel

import {
	Button,
	Container,
	Card,
	Row,
	Col,
	Pagination,
	FloatingLabel,
	Collapse,
	Form,
} from "react-bootstrap";

const Answers = () => {
	const [adviceIsHidden, setAdviceIsHidden] = useState(true);
	const [answersAreHidden, setAnswersAreHidden] = useState(true);

	return (
		<Container className={styles.container}>
			<Card body>
				<Row lg={12} className={styles.header}>
					<Col>
						<h5>
							Dolor sit amet consectetur adipiscing elit pellentesque habitant ?
						</h5>

						{adviceIsHidden ? (
							<Button
								className='btn-sm'
								onClick={() => {
									setAdviceIsHidden(false);
								}}
							>
								Help me!
							</Button>
						) : (
							<h6>
								habitant morbi tristique senectus et netus. Lorem sed risus
								ultricies tristique nulla aliquet enim. Blandit cursus risus at
								ultrices mi tempus.
							</h6>
						)}
					</Col>
				</Row>

				<Row>
					<Col lg='12'>
						<Button
							onClick={() => setAnswersAreHidden(value => !value)}
							aria-controls='example-collapse-text'
							aria-expanded={!answersAreHidden}
							className={`w-100 ${
								answersAreHidden ? "btn-success" : "btn-warning"
							}`}
						>
							{answersAreHidden ? "Show me the answers" : "Hide the answers"}
						</Button>
					</Col>
				</Row>
				<Collapse className={styles.collapse} in={!answersAreHidden}>
					<Row>
						<Col lg='12'>
							<Form.Group controlId='formGridState'>
								<Form.Control placeholder='Search' />
							</Form.Group>
						</Col>
						<Col lg='12'>
							<Table
								columns={["#", "Answer", "Likes", "Dislikes", "Actions"]}
								rows={[
									[
										1,
										"Dolor sit amet consectetur adipiscing elit pellentesque habitant. Nunc mattis enim ut tellus elementum sagittis vitae et leo. Facilisis sed odio morbi quis commodo odio aenean sed. Risus nullam eget felis eget nunc lobortis. Iaculis eu non diam phasellus. Vitae nunc sed velit dignissim sodales. Amet consectetur adipiscing elit pellentesque. Scelerisque in dictum non consectetur a erat nam. Diam ut venenatis tellus in metus vulputate.",
										20,
										"12/02/2021",
										<Button className='btn-sm bg-success'>Like</Button>,
										<Button className='btn-sm bg-danger'>Dislike</Button>,
									],
									[
										2,
										"Condimentum mattis pellentesque id nibh tortor id aliquet. Est velit egestas dui id ornare",
										5,
										"05/04/2021",
										<Button className='btn-sm bg-success'>Like</Button>,
										<Button className='btn-sm bg-danger'>Dislike</Button>,
									],
									[
										3,
										"Ultrices sagittis orci a scelerisque purus semper. Egestas maecenas pharetra convallis posuere morbi leo. Feugiat in ante metus dictum at tempor commodo ullamcorper",
										20,
										"12/02/2021",
										<Button className='btn-sm bg-success'>Like</Button>,
										<Button className='btn-sm bg-danger'>Dislike</Button>,
									],
									[
										4,
										" Nisi lacus sed viverra tellus in hac habitasse. Congue quisque egestas diam in arcu cursus euismod quis viverra. Eleifend quam adipiscing vitae proin sagittis nisl. Non odio euismod lacinia at quis risus. Ipsum consequat nisl vel pretium lectus. Non pulvinar neque laoreet suspendisse interdum consectetur libero. Nunc sed augue lacus viverra vitae congue eu consequat ac. Nascetur ridiculus mus mauris vitae ultricies.",
										5,
										"05/04/2021",
										<Button className='btn-sm bg-success'>Like</Button>,
										<Button className='btn-sm bg-danger'>Dislike</Button>,
									],
									[
										5,
										"Iaculis eu non diam phasellus Vitae nunc sed velit dignissim sodales",
										20,
										"12/02/2021",
										<Button className='btn-sm bg-success'>Like</Button>,
										<Button className='btn-sm bg-danger'>Dislike</Button>,
									],
									[
										6,
										"Blandit cursus risus at ultrices mi tempus",
										5,
										"05/04/2021",
										<Button className='btn-sm bg-success'>Like</Button>,
										<Button className='btn-sm bg-danger'>Dislike</Button>,
									],
								]}
							/>
						</Col>
						<Col lg='12' sm='12' md='12'>
							<Pagination>
								{[
									<Pagination.Item key={1} active>
										{1}
									</Pagination.Item>,
									<Pagination.Item key={2} active={false}>
										{2}
									</Pagination.Item>,
									<Pagination.Item key={3} active={false}>
										{3}
									</Pagination.Item>,
									<Pagination.Item key={4} active={false}>
										{4}
									</Pagination.Item>,
									<Pagination.Item key={5} active={false}>
										{5}
									</Pagination.Item>,
									<Pagination.Item key={6} active={false}>
										{6}
									</Pagination.Item>,
								]}
							</Pagination>
						</Col>
					</Row>
				</Collapse>
			</Card>
		</Container>
	);
};

export default Answers;

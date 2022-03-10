import parse from "html-react-parser";
import { Button, Container, Row, Col, Card, Form } from "react-bootstrap";
// styles

const MultipleChoice = ({ index, questiontext, answer, ...rest }) => {
	console.log({ answer });
	return (
		<Form className={styles.multipleChoice}>
			<Form.Label>
				{index})
				{questiontext
					? questiontext["@format"] === "html"
						? parse(questiontext.text)
						: `${index}) ${questiontext.text}`
					: null}
			</Form.Label>
			{answer &&
				answer.map(
					(ans, index) =>
						ans && (
							<div key={`inline-${ans}`} className='mb-3'>
								<Form.Check
									inline
									label={ans["@format"] === "html" ? parse(ans.text) : ans.text}
									name='group1'
									type='checkbox'
									id={`inline-${index}-1`}
								/>
							</div>
						)
				)}
		</Form>
	);
};

const Exam = ({ question }) => {
	return (
		<Container className={styles.container}>
			<Card body>
				<Row lg={12} className={styles.header}>
					<Col>
						<h3>Exam</h3>
					</Col>
				</Row>
				{question.map(
					(item, index) =>
						(item["@type"] = "multichoice" && (
							<Row className='mt-10'>
								<Col lg='12'>
									<MultipleChoice {...{ index, ...item }} />
								</Col>
							</Row>
						))
				)}
			</Card>
		</Container>
	);
};

export default Exam;

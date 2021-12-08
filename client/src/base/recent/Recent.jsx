import { Card, ListGroup } from "react-bootstrap";

const Recent = () => {
	return (<>
		<Card>
			<ListGroup variant="flush">
				<ListGroup.Item>Cras justo odio</ListGroup.Item>
				<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
				<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
			</ListGroup>
		</Card>
	</>);
};

export default Recent;
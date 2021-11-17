import { Table } from '../../base'
import {
	Button,
	Container,
	Row,
	Col,
	Card,
	ListGroup,
	InputGroup,
	FormControl,
} from 'react-bootstrap'
// styles
import styles from './profile.module.scss'

const Profile = () => {
	return (
		<Container className={styles.container}>
			<Card body>
				<Row lg={12} className={styles.header}>
					<Col>
						<h3>Ali Ghanbari</h3>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<Button>New questions in courses I'm enrolled in</Button>
					</Col>
				</Row>
				<Row>
					<Col lg='12'>
						<div className={styles.innerHeader}>
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
						<div className={styles.innerHeader}>
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
			</Card>
		</Container>
	)
}

export default Profile

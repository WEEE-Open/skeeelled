import { List, Recent } from "../base";
import { Button, Container, Row, Col, Pagination, Card, Form } from "react-bootstrap";
import { useEffect, useState/* , useEffect */ } from "react";
import "./Questions.css";
import Suggestion from "../base/Suggestion";


const Questions = () => {


	/** Mock courses **/
	const fakeQuestions = [
		{ id: 1, question: "What is a vector?", author: "Donato", createdat: "15:20 12/01/2021", tags: ["vectors"], excerpt: "Cras justo odio..." },
		{ id: 2, question: "Who is Maxwell?", author: "Jim", createdat: "17:30 13/02/2021", tags: ["physics"], excerpt: "Cras justo odio..." },
		{ id: 3, question: "How many meters per second?", author: "Derek", createdat: "19:40 14/03/2021", tags: ["physics", "kinematic"], excerpt: "Cras justo odio..." }
	];

	const [questions, setQuestions] = useState(fakeQuestions/*[]*/);
	const [suggestions, setSuggestions] = useState(fakeQuestions/*[]*/);

	// hook for responsive react
	const useMediaQuery = (query) => {

		const [matches, setMatches] =  useState(false);

		useEffect(()=> {
			const media = window.matchMedia(query);
			if (media.matches !== matches) {
				setMatches(media.matches);
			}
			const listener = () => {
				setMatches(media.matches);
			};
			window.addEventListener("resize", listener);
			return () => window.removeEventListener("resize", listener);
		}, [matches, query]);

		return matches;
	};

	// TODO: also take a look at Bootstrap class infixes to detect the current breakpoint
	// to see which approach is better -- https://getbootstrap.com/docs/5.1/layout/breakpoints/
	const isDesktop = useMediaQuery("(min-width: 960px)");

	return (
		<>
			{isDesktop?
				<>
					<Row>
						<Col>
							<Card body>
								<Container className="container">
									<Card body>
										<Row lg={12} className="header">
											<Col>
												<List scope="questions" title="Physics I" rows={questions}/>
											</Col>
											<Col className="pagination" lg='12' sm='12' md='12'>
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
									</Card>
								</Container>
							</Card>
						</Col>
						<Col className="d-none d-md-inline-block col-md-4">
							<Row><Suggestion scope={"suggestion"} title={"Latest Questions"} rows={suggestions} /></Row>
							<Row><Suggestion scope={"suggestion"} title={"Hottest Questions"} rows={suggestions} /></Row>
						</Col>
					</Row>
				</>
				:
				<>
					<Card body>
						<Container className="container">
							<Card body>
								<Row lg={12} className="header">
									<Col>
										<List scope="questions" title="Physics I" rows={questions}/>
									</Col>
									<Col className="pagination" lg='12' sm='12' md='12'>
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
							</Card>
						</Container>
					</Card>
					<Container>
						<Row md={2} sm={2}>
							<Col><Suggestion scope={"suggestion"} title={"Latest Questions"} rows={suggestions} /></Col>
							<Col><Suggestion scope={"suggestion"} title={"Hottest Questions"} rows={suggestions} /></Col>
						</Row>
					</Container>
				</>
			}
			{/*<Container className="container">*/}
			{/*	<Card body>*/}
			{/*		<Row lg={12} className="header">*/}
			{/*			<Col>*/}
			{/*				<List scope="questions" title="Physics I" rows={questions}/>*/}
			{/*				/!* <h3>*/}
			{/*				Data Management*/}
			{/*				<Button variant="secondary" className="mx-4">{"<- Back"}</Button>*/}
			{/*			</h3>*/}
			{/*		</Col>*/}
			{/*	</Row>*/}
			{/*	<Row className='mt-10'>*/}
			{/*		<Col lg='12'>*/}
			{/*			<Table*/}
			{/*				striped*/}
			{/*				columns={["#", "Question", "Answers", "Created At", "Actions"]}*/}
			{/*				rows={[*/}
			{/*					[*/}
			{/*						1,*/}
			{/*						"Senectus et netus et malesuada. Eu augue ut lectus arcu bibendum at. Congue mauris rhoncus aenean vel elit. ",*/}
			{/*						20,*/}
			{/*						"12/02/2021",*/}
			{/*						<Button className='btn-sm'>View</Button>,*/}
			{/*					],*/}
			{/*					[*/}
			{/*						2,*/}
			{/*						"Condimentum mattis pellentesque id nibh tortor id aliquet. Est velit egestas dui id ornare",*/}
			{/*						5,*/}
			{/*						"05/04/2021",*/}
			{/*						<Button className='btn-sm'>View</Button>,*/}
			{/*					],*/}
			{/*					[*/}
			{/*						3,*/}
			{/*						"Massa sapien faucibus et molestie ac feugiat",*/}
			{/*						20,*/}
			{/*						"12/02/2021",*/}
			{/*						<Button className='btn-sm'>View</Button>,*/}
			{/*					],*/}
			{/*					[*/}
			{/*						4,*/}
			{/*						"Diam ut venenatis tellus in metus vulputate.",*/}
			{/*						5,*/}
			{/*						"05/04/2021",*/}
			{/*						<Button className='btn-sm'>View</Button>,*/}
			{/*					],*/}
			{/*					[*/}
			{/*						5,*/}
			{/*						"Iaculis eu non diam phasellus Vitae nunc sed velit dignissim sodales",*/}
			{/*						20,*/}
			{/*						"12/02/2021",*/}
			{/*						<Button className='btn-sm'>View</Button>,*/}
			{/*					],*/}
			{/*					[*/}
			{/*						6,*/}
			{/*						"Blandit cursus risus at ultrices mi tempus",*/}
			{/*						5,*/}
			{/*						"05/04/2021",*/}
			{/*						<Button className='btn-sm'>View</Button>,*/}
			{/*					],*/}
			{/*				]}*/}
			{/*			/> *!/*/}
			{/*			</Col>*/}
			{/*			<Col className="pagination" lg='12' sm='12' md='12'>*/}
			{/*				<Pagination>*/}
			{/*					{[*/}
			{/*						<Pagination.Item key={1} active>*/}
			{/*							{1}*/}
			{/*						</Pagination.Item>,*/}
			{/*						<Pagination.Item key={2} active={false}>*/}
			{/*							{2}*/}
			{/*						</Pagination.Item>,*/}
			{/*						<Pagination.Item key={3} active={false}>*/}
			{/*							{3}*/}
			{/*						</Pagination.Item>,*/}
			{/*						<Pagination.Item key={4} active={false}>*/}
			{/*							{4}*/}
			{/*						</Pagination.Item>,*/}
			{/*						<Pagination.Item key={5} active={false}>*/}
			{/*							{5}*/}
			{/*						</Pagination.Item>,*/}
			{/*						<Pagination.Item key={6} active={false}>*/}
			{/*							{6}*/}
			{/*						</Pagination.Item>,*/}
			{/*					]}*/}
			{/*				</Pagination>*/}
			{/*			</Col>*/}
			{/*		</Row>*/}
			{/*	</Card>*/}
			{/*</Container>*/}
		</>
	);
};

export default Questions;

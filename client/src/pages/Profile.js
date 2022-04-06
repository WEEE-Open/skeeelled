import {Row, Col, Card} from "react-bootstrap";
import {useState} from "react";
import "./Profile.css";
import {ListGroup, SearchBar} from "../base/";

function Profile() {
	const fake = [
		{scope:"default",
		title:"New questions in courses I'm enrolled in",
		rows:[
			["Cras justo odio"],
			["Dapibus ac facilisis in"],
			["Morbi leo risus"],
			["Porta ac consectetur ac"],
			["Vestibulum at eros"]
		]},
		{scope:"test",
		title:"My questions",
		rows:[
			{a:"aaa",b:"bbb",c:"ccc"},
			{a:"aaa",b:"bbb",c:"ccc"},
			{a:"aaa",b:"bbb",c:"ccc"}
		]},
		{scope:"test",
		title:"My answers",
		rows:[
			{a:"aaa",b:"bbb",c:"ccc"},
			{a:"aaa",b:"bbb",c:"ccc"},
			{a:"aaa",b:"bbb",c:"ccc"}
		]},
		{scope:"default",
		title:"My courses",
		rows:[
			["aaa","bbb","ccc"],
			["aaa","bbb","ccc"],
			["aaa","bbb","ccc"],
		]},
		{scope:"test",
		title:"My results",
		rows:[
			{a:"aaa",b:"bbb",c:"ccc"},
			{a:"aaa",b:"bbb",c:"ccc"},
			{a:"aaa",b:"bbb",c:"ccc"}
		]}
	];

	const [tests,setTests] = useState(fake);

	return(
		<Card body>
			<Row lg={12} className="py-0 header">
				<Col>
					<h3>Hi, Name Surname!</h3>
				</Col>
				<SearchBar />
			</Row>
			<ListGroup lists={tests} cols={2} tiled rounded/>
		</Card>
	);
}

export default Profile;

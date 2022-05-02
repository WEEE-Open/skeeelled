import {Link, useLocation} from "react-router-dom";
import {useState} from "react";
import {Card, Row, Col, Pagination, Container} from "react-bootstrap";
import "./Simulation.css"
import {List, ListEntry} from "../base";



const PaginationRow = (props) => {
    let [active, setActive] = useState(1)
    let items = [];
    for( let num = 1; num <= 5; num++) {
        items.push(
            <Pagination.Item key={num} active={num === active} onClick={()=>{
                setActive(active = num)
            }}>
                {num}
            </Pagination.Item>
        )
    }

    return (
        <Pagination>
            <Pagination.First />
            {items}
            <Pagination.Last />
        </Pagination>
    )
}

export default function Simulation (props) {

    const fakeQuestions = [
        {
            id: 1,
            question: "What is a vector?",
            author: "Donato",
            createdat: "15:20 12/01/2021",
            tags: ["vectors"],
            excerpt: "Cras justo odio...",
        },
        {
            id: 2,
            question: "Who is Maxwell?",
            author: "Jim",
            createdat: "17:30 13/02/2021",
            tags: ["physics"],
            excerpt: "Cras justo odio...",
        },
        {
            id: 3,
            question: "How many meters per second?",
            author: "Derek",
            createdat: "19:40 14/03/2021",
            tags: ["physics", "kinematic"],
            excerpt: "Cras justo odio...",
        },
    ];

    const [questions, setQuestions] = useState(fakeQuestions /*[]*/);
    const location = useLocation()

    return (
        <Container>
            <h3>{location.state.type + " Questions of " + location.state.title}</h3>
            <Row className="pagination-finish" >
                <Col>
                    <PaginationRow/>
                </Col>
                <Col>
                    <Link className="outline-secondary" to={{pathname:"/"}}>
                        FINISH
                    </Link>
                </Col>
            </Row>
            <Card>
            </Card>
        </Container>
    )
}
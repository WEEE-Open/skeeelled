import {Link, useLocation} from "react-router-dom";
import {useCallback, useEffect, useState, Component} from "react";
import {Card, Row, Col, Pagination, Container, Button, Form} from "react-bootstrap";
import "./Simulation.css"
import {List, ListEntry, TextInput} from "../base";

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

    const simulationQuizType = ["open", "close"];
    const [pageNum, setPageNum] = useState(1)

    const radomizer = simulationQuizType[Math.floor(Math.random()*simulationQuizType.length)]
    const [randomQuizType,setRandomQuizType] = useState(radomizer)

    const locationState = useLocation().state



    const PaginationRow = (props) => {

        let items = [];
        for( let num = 1; num <= 5; num++) {
            items.push(
                <Pagination.Item key={num} active={num === pageNum} onClick={()=>{
                    setPageNum(num)
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

    useEffect(()=>{
        setRandomQuizType(radomizer)
    },[pageNum])

    return (
        <Container>
            <h3>{locationState.type + " Questions of " + locationState.title}</h3>
            <Row className="pagination-finish" >
                <Col>
                    <PaginationRow/>
                </Col>
                <Col>
                    <Link className="outline-secondary" to={{pathname:"/simulationresult/" + locationState.courseId}} state={{courseId:locationState.courseId, title:locationState.title}}>
                        <Button className="btn-outline-success" variant="outline-success">
                            Finish
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Card>
                <Card>
                    <h1>{"Question " + pageNum}</h1>
                    <Card.Text>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    </Card.Text>
                </Card>
                <Card>
                    { randomQuizType === "open"?(
                        <TextInput/>
                    ) : (

                            <Card>
                            {["A","B","C","D"].map(e => {
                                return(
                                    <Form.Check type="default-checkbox" label={e}/>
                                )
                            })}
                            </Card>
                        ) }
                </Card>
            </Card>
        </Container>
    )
}
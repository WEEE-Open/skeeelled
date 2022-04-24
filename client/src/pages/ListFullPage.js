import {List} from "../base";
import {Card, Container, Pagination} from "react-bootstrap";
import {useLocation} from "react-router-dom";
import {useState} from "react";

function PaginationRow() {
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

function ListFullPage () {
    const location = useLocation();
    return (
        <>
            <Container>
                <Card body>
                    <h2>{location.state.title}</h2>
                    <List scope={location.state.scope} title={""} rows={location.state.rows}/>
                    {location.state.title === "My courses"? <></>:<PaginationRow/>}
                </Card>
            </Container>
        </>
    )
}

export default ListFullPage
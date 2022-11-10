import {MyPagination, Table} from "../base";
import { Button, Container, Row, Col, Pagination, Card } from "react-bootstrap";
import "./MyQuestions.css";

const myQuestions = () => {
  return (
    <Container className="container">
      <Card body>
        <Row lg={12} className="header">
          <Col>
            <h3>My Questions</h3>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col lg="12">
            <Table
              striped
              columns={["#", "Question", "Answers", "Created At", "Actions"]}
              rows={[
                [
                  1,
                  "Senectus et netus et malesuada. Eu augue ut lectus arcu bibendum at. Congue mauris rhoncus aenean vel elit. ",
                  20,
                  "12/02/2021",
                  <Button className="btn-sm">View</Button>,
                ],
                [
                  2,
                  "Condimentum mattis pellentesque id nibh tortor id aliquet. Est velit egestas dui id ornare",
                  5,
                  "05/04/2021",
                  <Button className="btn-sm">View</Button>,
                ],
                [
                  3,
                  "Massa sapien faucibus et molestie ac feugiat",
                  20,
                  "12/02/2021",
                  <Button className="btn-sm">View</Button>,
                ],
                [
                  4,
                  "Diam ut venenatis tellus in metus vulputate.",
                  5,
                  "05/04/2021",
                  <Button className="btn-sm">View</Button>,
                ],
                [
                  5,
                  "Iaculis eu non diam phasellus Vitae nunc sed velit dignissim sodales",
                  20,
                  "12/02/2021",
                  <Button className="btn-sm">View</Button>,
                ],
                [
                  6,
                  "Blandit cursus risus at ultrices mi tempus",
                  5,
                  "05/04/2021",
                  <Button className="btn-sm">View</Button>,
                ],
              ]}
            />
          </Col>
          <MyPagination/>
        </Row>
      </Card>
    </Container>
  );
};

export default myQuestions;

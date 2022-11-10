import {List, MyPagination} from "../base";
import { Card, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./stylesheet/ListFullPage.css";


export default function ListFullPage() {
  const location = useLocation();
  return (
    <>
      <Container>
        <div className="list-full-page">
          <List
            scope={location.state.scope}
            title={location.state.title}
            rows={location.state.rows}
            rounded
            tiled
            dotted
          />
          {location.state.title === "My courses" ? <></> : <MyPagination />}
        </div>
      </Container>
    </>
  );
}

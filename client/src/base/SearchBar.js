import React, { useRef, useState, useEffect } from "react";
import { InputGroup, Button } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import API from "../api/API";

// import styles from "./searchBar/searchBar.module.scss";
import styles from "./stylesheet/SearchBar.scss";
import "./stylesheet/SearchBar.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

function SearchBar({ apiCall }) {
// function SearchBar(props) {
  /* Mock search suggestions */

  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const charChange = async () => {
      try {
        // const res = await apiCall(value);
      } catch (err) {
        console.error(err.error);
      }
    };
    charChange();
  }, [value]);

  const onSearch = async (inputText) => {
    //TODO REMOVE THESE
    apiCall.courseId = "19IT0SW";
    apiCall.questionId = "641cca4fd104b2e33e8d4c1b";
    //-------------------
    setValue(inputText);
    if (inputText.length > 0) {
      let risultati = [];
      if(apiCall.scope === "courses")
        risultati = await API.searchCourses(inputText);
      else if(apiCall.scope === "questions")
        risultati = await API.searchQuestion(inputText, apiCall.courseId);
      else if(apiCall.scope === "discussion")
        risultati = await API.searchDiscussion(inputText, apiCall.questionId);

      console.log(risultati);
    } else {
      setSuggestions([]);
    }
  };

  const ref = useRef();

  return (
    <InputGroup>
      <AsyncTypeahead
        id="Search bar"
        placeholder={"Search between " + apiCall.scope + "..."}
        isLoading={false}
        searchText=""
        emptyLabel=""
        promptText="xxx"
        options={suggestions}
        filterBy={() => true}
        renderMenuItemChildren={(option) => <span>{option.label}</span>}
        ref={ref}
        onChange={() => {
          console.log(value);
        }}
        onInputChange={onSearch}
        onSearch={() => {}}
        className="async-type-head"
      />
      {/*{value.length > 0 && (*/}
      {/*  <Button*/}
      {/*    variant="link"*/}
      {/*    onClick={() => {*/}
      {/*      ref.current.clear();*/}
      {/*      setValue("");*/}
      {/*    }}*/}
      {/*    className={*/}
      {/*      "btn-outline-primary border-left-0 border " + styles.clearButton*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <img*/}
      {/*      width="20"*/}
      {/*      height="20"*/}
      {/*      src={process.env.PUBLIC_URL + "/icons/x.svg"}*/}
      {/*      alt="Search"*/}
      {/*    />*/}
      {/*  </Button>*/}
      {/*)}*/}
      {/*<Button*/}
      {/*  variant={value.length > 0 ? "primary" : "link"}*/}
      {/*  className="btn-outline-primary border-left-0 border"*/}
      {/*>*/}
      {/*  <img*/}
      {/*    width="20"*/}
      {/*    height="20"*/}
      {/*    src={process.env.PUBLIC_URL + "/icons/SEARCH.svg"}*/}
      {/*    alt="Search"*/}
      {/*  />*/}
      {/*</Button>*/}
    </InputGroup>
  );
}

export default SearchBar;

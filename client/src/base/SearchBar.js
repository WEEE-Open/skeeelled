import React, { useRef, useState } from "react";
import { InputGroup, Button } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import styles from "./searchBar/searchBar.module.scss";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

function SearchBar({ apiCall }) {

	/* Mock search suggestions */
	const fakeSuggestions = [
		{ label: "duckduckgo" },
		{ label: "duckduck" },
		{ label: "duckduckgo browser" },
		{ label: "duckduckgo download" }
	];

	const [suggestions, setSuggestions] = useState([]);
	const [value, setValue] = useState("");

	const onSearch = (inputText) => {
		setValue(inputText);
		if (inputText.length > 0) {
			setSuggestions(fakeSuggestions);
		}
		else {
			setSuggestions([]);
		}
	};

	const ref = useRef();

	return (
		<InputGroup>
			<AsyncTypeahead
				id="Search bar"
				placeholder="Search courses"
				isLoading={false}
				searchText=""
				emptyLabel=""
				promptText=""
				options={suggestions}
				filterBy={() => true}
				renderMenuItemChildren={(option) => <span>{option.label}</span>}
				ref={ref}
				onInputChange={onSearch}
				onSearch={() => { }}
			/>
			{value.length > 0 && (
				<Button
					variant="link"
					onClick={() => {
						ref.current.clear();
						setValue("");
					}}
					className={"btn-outline-primary border-left-0 border " + styles.clearButton}
				>
					<img width="20" height="20" src="icons/x.svg" alt="Search" />
				</Button>
			)}
			<Button variant={value.length > 0 ? "primary" : "link"} className="btn-outline-primary border-left-0 border">
				<img width="20" height="20" src="/icons/SEARCH.svg" alt="Search" />
			</Button>
		</InputGroup>
	);
}

export default SearchBar;
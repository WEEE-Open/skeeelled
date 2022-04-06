import React, { forwardRef, useState, useEffect } from "react";
import { Form, Dropdown, InputGroup, Button } from "react-bootstrap";
import iconSearch from "./searchBar/SEARCH.svg";
import iconClear from "./searchBar/CLEAR.svg";
import styles from "./searchBar/searchBar.module.scss";
import API from "../api/API";

const SearchInput = forwardRef(({ onClick, onChange, value, onClear }, ref) => {
	return (
		<InputGroup>
			<Form.Control
				ref={ref}
				onClick={(e) => {
					e.preventDefault();
					onClick(e);
				}}
				onChange={onChange}
				type="text"
				placeholder="Search courses"
				className={"mx-auto border-right-0 border " + styles.textInput}
				value={value}

			/>
			<InputGroup.Append>
				{value.length > 0 && (
					<Button variant="link" onClick={onClear} className={"btn-outline-primary border-left-0 border " + styles.clearButton}>
						<img width="20" height="20" src={iconClear} alt="Search" />
					</Button>
				)}
				<Button variant={value.length > 0 ? "primary" : "link"} className="btn-outline-primary border-left-0 border">
					<img width="20" height="20" src={iconSearch} alt="Search" />
				</Button>
			</InputGroup.Append>
		</InputGroup>
	);
});

SearchInput.displayName = "SearchInput";

function SearchBar({ apiCall }) {

	/* Mock search suggestions */
	const fakeSuggestions = [
		"duckduckgo",
		"duckduck",
		"duckduckgo browser",
		"duckduckgo download"
	];

	const [suggestions, setSuggestions] = useState([]);
	const [inputText, setInputText] = useState("");

	// Api call to get suggestions
	const getSuggestions = () => {
		console.log("get suggestions");
	};

	useEffect(() => {
		if (inputText.length > 0) {
			setSuggestions(fakeSuggestions);
		}
		else {
			setSuggestions([]);
		}
	}, [inputText]);

	const onChangeInput = (event) => {
		setInputText(event.target.value);
	};

	const clearInput = () => {
		setInputText("");
	};

	return (
		<Dropdown>
			<Dropdown.Toggle as={SearchInput} onChange={onChangeInput} value={inputText} onClear={clearInput} />
			{suggestions.length > 0 && (
				<Dropdown.Menu className="w-100">
					{suggestions.map((s, i) => (
						<Dropdown.Item key={i} onFocus={() => setInputText(s)} onClick={() => setInputText(s)}>{s}</Dropdown.Item>
					))}
				</Dropdown.Menu>
			)}
		</Dropdown>
	);
}

export default SearchBar;
import React, { forwardRef, useState } from "react";
import { Form, Dropdown } from "react-bootstrap";
import API from "../api/API";

const SearchInput = forwardRef(({ onClick, onChange }, ref) => {
	return (
		<Form.Control
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
			onChange={onChange}
			type="text"
			placeholder="Search courses"
			className="mx-auto"/>
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

	// Api call to get suggestions
	const getSuggestions = () => {
		console.log("get suggestions");
	}

	const [suggestions, setSuggestions] = useState(fakeSuggestions);

	return (
		<Dropdown>
			<Dropdown.Toggle as={SearchInput} onChange={getSuggestions}>Toggle</Dropdown.Toggle>
			{suggestions.length > 0 && (
				<Dropdown.Menu>
					{suggestions.map((s, i) => (
						<Dropdown.Item key={i}>{s}</Dropdown.Item>
					))}
				</Dropdown.Menu>
			)}
		</Dropdown>
	);
}

export default SearchBar;
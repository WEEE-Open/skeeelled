import React, { forwardRef, useState } from "react";
import { Form, Dropdown } from "react-bootstrap";
import API from "../api/API";

const SearchInput = forwardRef(({ onClick, onChange, value }, ref) => {
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
			className="mx-auto"
			value={value}
		/>
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

	const [suggestions, setSuggestions] = useState(fakeSuggestions);
	const [inputText, setInputText] = useState("");

	// Api call to get suggestions
	const getSuggestions = () => {
		console.log("get suggestions");
	};

	const onChangeInput = (event) => {
		setInputText(event.target.value);
		getSuggestions();
	};

	return (
		<Dropdown>
			<Dropdown.Toggle as={SearchInput} onChange={onChangeInput} value={inputText} />
			{suggestions.length > 0 && (
				<Dropdown.Menu>
					{suggestions.map((s, i) => (
						<Dropdown.Item key={i} onFocus={() => setInputText(s)} onClick={() => setInputText(s)}>{s}</Dropdown.Item>
					))}
				</Dropdown.Menu>
			)}
		</Dropdown>
	);
}

export default SearchBar;
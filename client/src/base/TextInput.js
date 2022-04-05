import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "react-mde/lib/styles/css/react-mde-all.css";
import "katex/dist/katex.min.css";

function TextInput() {
	const [value, setValue] = useState("");
	const [selectedTab, setSelectedTab] = useState("write");


	return (
		<Container>
			<ReactMde 
				value={value}
				onChange={setValue}
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
				generateMarkdownPreview={(markdown) => 
					Promise.resolve(
						<ReactMarkdown
							remarkPlugins={[remarkGfm, remarkMath]}
							rehypePlugins={[rehypeKatex]}
						>
							{markdown}
						</ReactMarkdown>
					)
				}
			/>
		</Container>
	);
}

export default TextInput;
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const { PUBLIC_URL } = process.env;
const splitArray = PUBLIC_URL.split("://")[1].split("/");
const basename = splitArray.length > 1 && `/${splitArray[splitArray.length - 1]}` || "";

ReactDOM.render(
	// <React.StrictMode>
	<Router basename={basename}>
		<App />
	</Router>,
	// </React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

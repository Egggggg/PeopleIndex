import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./app";
import UserInfo from "./userInfo";
import Dexie from "dexie";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<details style={{ whiteSpace: "pre-wrap" }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</div>
			);
		}

		return this.props.children;
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});
	}
}

const db = new Dexie("PeopleIndexUserData");

db.version(1).stores({
	users:
		"++id, name, age, birthDay, birthMonth, pseudonyms, firstMet, lastSpoke"
});

ReactDOM.render(
	<React.StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App db={db} />}>
						<Route index>
							<div class="text-center mt-3">
								<h1>People Index</h1>
								<h3>Know your people.</h3>
							</div>
						</Route>
						<Route path=":id" element={<UserInfo />}></Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById("root")
);

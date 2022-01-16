import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Dexie from "dexie";
import * as serviceWorker from "./serviceWorkerRegistration";

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

async function main() {
	const db = new Dexie("PeopleIndexUserData");

db.version(2).stores({
	users:
		"++id, name, age, birthDay, birthMonth, pseudonyms, firstMet, lastSpoke",
	settings: "id, dateFormat",
	defaults: "dateFormat"
});


	ReactDOM.render(
		<React.StrictMode>
			<ErrorBoundary>
				<App db={db} />
			</ErrorBoundary>
		</React.StrictMode>,
		document.getElementById("root")
	);

	serviceWorker.register();
}

main();

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
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
			<App db={db} />
		</ErrorBoundary>
	</React.StrictMode>,
	document.getElementById("root")
);

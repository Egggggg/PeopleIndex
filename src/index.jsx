import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Dexie from "dexie";
import * as serviceWorker from "./serviceWorkerRegistration";

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

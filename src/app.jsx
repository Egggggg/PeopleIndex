import React, { useState } from "react";
import Dexie from "dexie";
import Form from "./form";

export default function App() {
	const [db] = useState(new Dexie("PeopleIndexUserData"));

	db.version(1).stores({
		users:
			"++id, name, age, birthDay, birthMonth, pseudonyms, firstMet, lastSpoke"
	});

	return (
		<div>
			<Form db={db} />
		</div>
	);
}

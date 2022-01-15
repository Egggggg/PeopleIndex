import React, { useState } from "react";
import Dexie from "dexie";
import Form from "./form";

export default function App() {
	const [db] = useState(new Dexie("PeopleIndexUserData"));

	return (
		<React.StrictMode>
			<div>
				<Form db={db} />
			</div>
		</React.StrictMode>
	);
}

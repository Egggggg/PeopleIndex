import React, { useState } from "react";
import Dexie from "dexie";
import Form from "./form";
import UserList from "./userList";
import UserInfo from "./userInfo";

export default function App() {
	const [db] = useState(new Dexie("PeopleIndexUserData"));

	return (
		<React.StrictMode>
			<div>
				<UserList list={userList} />
				<Form db={db} />
				<UserInfo db={db} />
			</div>
		</React.StrictMode>
	);
}

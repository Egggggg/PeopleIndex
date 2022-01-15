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
				<UserList db={db} users={users} setUsers={setUsers} />
				<Form db={db} refresh={refresh} />
				<UserInfo db={db} />
			</div>
		</React.StrictMode>
	);
}

import React, { useState } from "react";
import Form from "./form";
import UserList from "./userList";
import UserInfo from "./userInfo";
import { refresh } from "./func";

const order = [
	"name:::::Name",
	"pseudonyms:::::Other Names",
	"age:::::Age",
	"birthDate:::::Birthday",
	"religion:::::Religion",
	"nationality:::::Nationality",
	"heritage:::::Heritage",
	"firstMetStr:::::First Met",
	"lastSpokeStr:::::Last Spoke",
	"notes:::::Notes"
];

export default function App({ db }) {
	const [users, setUsers] = useState([]);

	return (
		<div>
			<UserList users={users} refresh={refresh(setUsers, db)} />
			<Form db={db} refresh={refresh(setUsers, db)} order={order} />
			<UserInfo db={db} />
		</div>
	);
}

import React, { useState } from "react";
import Form from "./form";
import UserList from "./userList";
import UserInfo from "./userInfo";
import { refresh, selectUser } from "./func";

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
	const [selectedUser, setSelectedUser] = useState({});

	if (Object.keys(selectedUser).length === 0) {
		return (
			<div class="text-center mt-3">
				<h1>People Index</h1>
				<h3>Know your people.</h3>
			</div>
		);
	}

	return (
		<div>
			<UserList
				users={users}
				refresh={refresh(setUsers, setSelectedUser, db)}
			/>
			<Form
				db={db}
				refresh={refresh(setUsers, setSelectedUser, db)}
				setSelectedUser={selectUser(setSelectedUser, db)}
				order={order}
			/>
			<UserInfo user={selectedUser} db={db} order={order} />
		</div>
	);
}

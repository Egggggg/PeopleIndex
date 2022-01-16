import React, { useState } from "react";
import Dexie from "dexie";
import Form from "./form";
import UserList from "./userList";
import UserInfo from "./userInfo";

export default function App() {
	const [db] = useState(new Dexie("PeopleIndexUserData"));
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState({});

	return (
		<React.StrictMode>
			<div>
				<UserList
					db={db}
					users={users}
					setUsers={setUsers}
					setUser={setSelectedUser}
				/>
				<Form
					db={db}
					refresh={refresh(setUsers, setSelectedUser, db)}
					setSelectedUser={setSelectedUser}
				/>
				<UserInfo user={selectedUser} />
			</div>
		</React.StrictMode>
	);
}

function refresh(setUsers, db) {
	db.users.toArray().then((data) => {
		const users = data.map((user) => {
			const now = Date.now();
			let sinceSpoke = now - user.lastSpoke;

			sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

			let lastSpoke = new Date(user.lastSpoke);

			lastSpoke = `${
				lastSpoke.getMonth() + 1
			}-${lastSpoke.getDate()}-${lastSpoke.getFullYear()}`;

			return (
				<tr key={user.id}>
					<td id={`name-${user.id}`}>{user.name}</td>
					<td id={`since-${user.id}`}>{sinceSpoke}</td>
					<td id={`last-${user.id}`}>{lastSpoke}</td>
					<td>
						<button onClick={deleteUser(setUsers, db)} id={user.id}>
							Delete
						</button>
					</td>
				</tr>
			);
		});

		setUsers(users);
	});
}

const deleteUser = (setUsers, db) => async (e) => {
	await db.users.delete(parseInt(e.target.id));
	refresh(setUsers, db);
};

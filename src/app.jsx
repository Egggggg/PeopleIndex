import React, { useState, useEffect } from "react";
import Form from "./form";
import UserList from "./userList";
import UserInfo from "./userInfo";

export default function App({ db }) {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState({});

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
			/>
			<UserInfo user={selectedUser} />
		</div>
	);
}

const refresh = (setUsers, setSelectedUser, db) => async () => {
	const now = Date.now();
	const data = await db.users.toArray();
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
				<td id={`name-${user.id}`}>
					<button onClick={selectUser(setSelectedUser, db, user.id)}>
						{user.name}
					</button>
				</td>
				<td id={`since-${user.id}`}>{sinceSpoke}</td>
				<td id={`last-${user.id}`}>{lastSpoke}</td>
				<td id={`delete-${user.id}`}>
					<button onClick={deleteUser(setUsers, db, user.id)}>Delete</button>
				</td>
			</tr>
		);
	});

	setUsers(users);
};

const selectUser = (setSelectedUser, db, userid) => async (e) => {
	const userData = await db.users.get({ id: userid });

	if (userData.birthDay !== "" && userData.birthMonth !== "") {
		userData["birthDate"] = `${userData.birthDay - userData.birthMonth}`;
	}

	setSelectedUser(userData);
};

const deleteUser = (setUsers, db, userid) => async (e) => {
	await db.users.delete(parseInt(userid));
	refresh(setUsers, db);
};

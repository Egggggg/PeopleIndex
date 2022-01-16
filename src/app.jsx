import React, { useState, useEffect } from "react";
import Form from "./form";
import UserList from "./userList";
import UserInfo from "./userInfo";

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
const dateOptions = {
	timeZone: "UTC",
	month: "numeric",
	day: "numeric",
	year: "numeric"
};

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
				order={order}
			/>
			<UserInfo user={selectedUser} db={db} order={order} />
		</div>
	);
}

const refresh = (setUsers, setSelectedUser, db) => async () => {
	const now = Date.now();
	const data = await db.users.toArray();

	const promises = data.map(async (user) => {
		let sinceSpoke = now - user.lastSpoke;

		sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

		let lastSpoke = new Date(user.lastSpoke);

		lastSpoke = lastSpoke.toLocaleDateString(undefined, dateOptions);

		return (
			<tr key={user.id}>
				<td id={`name-${user.id}`}>
					<button onClick={selectUser(setSelectedUser, db)(user.id)}>
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

	Promise.all(promises).then((users) => {
		setUsers(users);
	});
};

const selectUser = (setSelectedUser, db) => (userId) => async (e) => {
	const userData = await db.users.get({ id: userId });

	if (userData.birthMonth && userData.birthDay) {
		const birthDate = new Date(`${userData.birthMonth}-${userData.birthDay}`);

		userData.birthDate = birthDate.toLocaleDateString(undefined, {
			timeZone: "UTC",
			month: "numeric",
			day: "numeric"
		});
	}

	if (userData.firstMet) {
		const firstMet = new Date(userData.firstMet);

		userData.firstMetStr = firstMet.toLocaleDateString(undefined, dateOptions);
	}

	if (userData.lastSpoke) {
		const lastSpoke = new Date(userData.lastSpoke);

		userData.lastSpokeStr = lastSpoke.toLocaleDateString(
			undefined,
			dateOptions
		);
	}

	if (!userData.order) {
		await db.users.update(userData.id, { order: order });
	}

	setSelectedUser(userData);
};

const deleteUser = (setUsers, db, userid) => async (e) => {
	await db.users.delete(parseInt(userid));
	refresh(setUsers, db);
};

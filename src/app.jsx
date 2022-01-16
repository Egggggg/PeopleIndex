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
			/>
			<UserInfo user={selectedUser} />
		</div>
	);
}

async function getDateFormat(db, userId = -1, defaultFormat = -1) {
	let userDateFormat;
	let defaultDateFormat = defaultFormat;

	if (userId !== -1) {
		userDateFormat = await db.settings.get(userId)?.dateFormat;
	}

	if (defaultFormat === -1) {
		defaultDateFormat = await db.defaults.get(0).dateFormat;
	}

	return userDateFormat ? userDateFormat : defaultDateFormat;
}

const refresh = (setUsers, setSelectedUser, db) => async () => {
	const now = Date.now();
	const data = await db.users.toArray();

	let defaultDateFormat = await db.defaults.get(0).dateFormat;

	const promises = data.map(async (user) => {
		let sinceSpoke = now - user.lastSpoke;

		sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

		let lastSpoke = new Date(user.lastSpoke);

		const dateFormat = await getDateFormat(db, user.id, defaultDateFormat);

		if (dateFormat === "en_US") {
			lastSpoke = `${
				lastSpoke.getUTCMonth() + 1
			}-${lastSpoke.getUTCDate()}-${lastSpoke.getUTCFullYear()}`;
		} else {
			lastSpoke = `${lastSpoke.getUTCDate()}-${
				lastSpoke.getUTCMonth() + 1
			}-${lastSpoke.getUTCFullYear()}`;
		}

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
	const dateFormat = await getDateFormat(db, userData.id);

	if (userData.birthDay !== "" && userData.birthMonth !== "") {
		if (dateFormat === "en_US") {
			userData.birthDate = `${userData.birthMonth}-${userData.birthDay}`;
		} else {
			userData.birthDate = `${userData.birthDay}-${userData.birthMonth}`;
		}
	}

	const firstMet = new Date(userData.firstMet);
	const lastSpoke = new Date(userData.lastSpoke);

	if (dateFormat === "en_US") {
		userData.firstMetStr = firstMet
			? `${
					firstMet.getUTCMonth() + 1
			  }-${firstMet.getUTCDate()}-${firstMet.getUTCFullYear()}`
			: undefined;
		userData.lastSpokeStr = lastSpoke
			? `${
					lastSpoke.getUTCMonth() + 1
			  }-${lastSpoke.getUTCDate()}-${lastSpoke.getUTCFullYear()}`
			: undefined;
	} else {
		userData.firstMetStr = firstMet
			? `${firstMet.getUTCDate()}-${
					firstMet.getUTCMonth() + 1
			  }-${firstMet.getUTCFullYear()}`
			: undefined;
		userData.lastSpokeStr = lastSpoke
			? `${lastSpoke.getUTCDate()}-${
					lastSpoke.getUTCMonth() + 1
			  }-${lastSpoke.getUTCFullYear()}`
			: undefined;
	}

	setSelectedUser(userData);
};

const deleteUser = (setUsers, db, userid) => async (e) => {
	await db.users.delete(parseInt(userid));
	refresh(setUsers, db);
};

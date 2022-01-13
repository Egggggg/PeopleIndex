import React, { useState } from "react";
import Field from "./field";

export default function Form({ db }) {
	const [user, setUser] = useState({
		name: "",
		pseudonyms: "",
		age: "",
		birthDay: "",
		birthMonth: "",
		religion: "",
		nationality: "",
		heritage: "",
		firstMet: "",
		firstMetStr: "",
		lastSpoke: "",
		lastSpokeStr: ""
	});

	const [users, setUsers] = useState([]);
	const fields = [
		{
			placeholder: "Name",
			br: true
		},
		{
			placeholder: "Other Names",
			name: "pseudonyms",
			br: true
		},
		{
			type: "number",
			placeholder: "Age",
			br: true
		},
		{
			type: "number",
			placeholder: "Birth Day",
			name: "birthDay",
			min: "1",
			max: "31"
		},
		{
			type: "number",
			placeholder: "Birth Month",
			name: "birthMonth",
			min: "1",
			max: "12",
			br: true
		},
		{
			placeholder: "Religion",
			br: true
		},
		{
			placeholder: "Nationality",
			br: true
		},
		{
			placeholder: "Heritage",
			br: true
		},
		{
			label: "First Met: ",
			type: "date",
			name: "firstMet",
			value: user.firstMetStr,
			br: true
		},
		{
			label: "Last Spoke: ",
			type: "date",
			name: "lastSpoke",
			value: user.lastSpokeStr,
			br: true
		},
		{
			type: "textarea",
			placeholder: "Notes"
		}
	];

	const fieldElements = createFields(user, setUser, fields);

	refresh(setUsers, db);

	return (
		<div>
			<table>
				<tbody>{users}</tbody>
			</table>
			<form onSubmit={handleSubmit}>
				{fieldElements}
				<input type="submit" value="Submit" />
			</form>
			<button onClick={exportData}>Export</button>
		</div>
	);
}

function createFields(user, setUser, fields) {
	return fields.map((field) => {
		const placeholder = field.placeholder;

		let type = field.type || "text";
		let name = field.name || placeholder.toLowerCase();
		let value = field.value || user[name];
		let br = field.br || false;

		let label = field.label;
		let min = field.min;
		let max = field.max;

		return (
			<Field
				placeholder={placeholder}
				type={type}
				name={name}
				value={value}
				label={label}
				min={min}
				max={max}
				handleChange={handleChange}
				user={user}
				setUser={setUser}
				br={br}
				key={field.name}
			/>
		);
	});
}

function clearData(setUser) {
	setUser({
		name: "",
		pseudonyms: "",
		age: "",
		birthDay: "",
		birthMonth: "",
		religion: "",
		nationality: "",
		heritage: "",
		firstMet: "",
		firstMetStr: "",
		lastSpoke: "",
		lastSpokeStr: ""
	});
}

const handleChange = (user, setUser) => (e) => {
	const field = e.target.name;
	let value = e.target.value;

	if (e.target.type === "number") {
		value = parseInt(e.target.value);
	} else if (e.target.type === "date") {
		const dateObj = new Date(e.target.value);

		setUser({ ...user, [`${field}Str`]: value });

		value = dateObj.getTime();
		console.log(value);
	}

	setUser({ ...user, [field]: value });
};

const handleSubmit = (db, user) => (e) => {
	e.preventDefault();
	db.users.add(user);
	refresh();
	clearData();
};

async function getNewFileHandle() {
	const options = {
		suggestedName: "users.json",
		startIn: "downloads",
		types: [
			{
				description: "JSON Files",
				accept: {
					"text/plain": [".json"]
				}
			}
		]
	};

	try {
		const handle = await window.showSaveFilePicker(options);
		return handle;
	} catch {
		return null;
	}
}

function exportData(db) {
	db.table("users")
		.toArray()
		.then(async (data) => {
			const handle = await getNewFileHandle();

			if (handle) {
				const writable = await handle.createWritable();

				await writable.write(JSON.stringify(data, null, 2));
				await writable.close();
			}
		});
}

const deleteUser = (db) => async (e) => {
	await db.users.delete(parseInt(e.target.id));
	refresh();
};

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
						<button onClick={deleteUser} id={user.id}>
							Delete
						</button>
					</td>
				</tr>
			);
		});

		setUsers(users);
	});
}

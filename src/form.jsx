import React, { useState, useEffect } from "react";

export default function Form({ db, refresh }) {
	useEffect(() => {
		db.version(1).stores({
			users:
				"++id, name, age, birthDay, birthMonth, pseudonyms, firstMet, lastSpoke"
		});
	}, [db]);

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
		lastSpokeStr: "",
		notes: "",
		order: [
			"name",
			"pseudonyms",
			"age",
			"birthdate",
			"religion",
			"nationality",
			"heritage",
			"firstMetStr",
			"lastSpokeStr",
			"notes"
		]
	});

	return (
		<div>
			<form onSubmit={handleSubmit(db, user, refresh, setUser)}>
				<input
					type="text"
					placeholder="Name"
					name="name"
					onChange={handleChange(user, setUser)}
					value={user.name}
				/>
				<br />
				<input
					type="text"
					placeholder="Other Names"
					name="pseudonyms"
					onChange={handleChange(user, setUser)}
					value={user.pseudonyms}
				/>
				<br />
				<input
					type="number"
					placeholder="Age"
					name="age"
					onChange={handleChange(user, setUser)}
					value={user.age}
				/>
				<br />
				<input
					type="number"
					placeholder="Birth Day"
					name="birthDay"
					onChange={handleChange(user, setUser)}
					max="31"
					min="1"
					value={user.birthDay}
				/>
				<input
					type="number"
					placeholder="Birth Month"
					name="birthMonth"
					onChange={handleChange(user, setUser)}
					max="12"
					min="1"
					value={user.birthMonth}
				/>
				<br />
				<input
					type="text"
					placeholder="Religion"
					name="religion"
					onChange={handleChange(user, setUser)}
					value={user.religion}
				/>
				<br />
				<input
					type="text"
					placeholder="Nationality"
					name="nationality"
					onChange={handleChange(user, setUser)}
					value={user.nationality}
				/>
				<br />
				<input
					type="text"
					placeholder="Heritage"
					name="heritage"
					onChange={handleChange(user, setUser)}
					value={user.heritage}
				/>
				<br />
				<label htmlFor="firstMet">First Met: </label>
				<input
					type="date"
					name="firstMet"
					onChange={handleChange(user, setUser)}
					value={user.firstMetStr}
				/>
				<br />
				<label htmlFor="lastSpoke">Last Spoke: </label>
				<input
					type="date"
					name="lastSpoke"
					onInput={handleChange(user, setUser)}
					value={user.lastSpokeStr}
				/>
				<br />
				<textarea
					placeholder="Notes"
					name="notes"
					onChange={handleChange(user, setUser)}
					value={user.notes}
				/>
				<br />
				<input type="submit" value="Submit" />
			</form>
			<button onClick={exportData}>Export</button>
		</div>
	);
}

const handleChange = (user, setUser) => (e) => {
	const newData = {};
	const field = e.target.name;
	let value = e.target.value;

	if (e.target.type === "number") {
		value = parseInt(value);
	} else if (e.target.type === "date") {
		const dateObj = new Date(value);

		newData[`${field}Str`] = value;

		value = dateObj.getTime();
	}

	newData[field] = value;

	setUser({ ...user, ...newData });
};

const handleSubmit = (db, user, refresh, setUser) => (e) => {
	e.preventDefault();
	db.users.add(user);
	refresh();
	clearData(setUser);
};

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
		lastSpokeStr: "",
		notes: ""
	});
}

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

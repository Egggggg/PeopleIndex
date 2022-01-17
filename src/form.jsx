import React, { useState } from "react";

export default function Form({ db, setUsers, getUserList, order }) {
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
		firstMetVal: "",
		lastSpoke: "",
		lastSpokeVal: "",
		notes: "",
		order: order
	});

	return (
		<div>
			<form
				onSubmit={handleSubmit(db, user, setUser, setUsers, getUserList, order)}
			>
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
					value={user.firstMetVal}
				/>
				<br />
				<label htmlFor="lastSpoke">Last Spoke: </label>
				<input
					type="date"
					name="lastSpoke"
					onInput={handleChange(user, setUser)}
					value={user.lastSpokeVal}
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

	if (value !== "") {
		if (e.target.type === "number") {
			value = parseInt(value);
		} else if (e.target.type === "date") {
			const dateObj = new Date(value);

			newData[`${field}Val`] = value;

			value = dateObj.getTime();
		}
	}

	newData[field] = value;

	setUser({ ...user, ...newData });
};

const handleSubmit =
	(db, user, setUser, setUsers, getUserList, order) => async (e) => {
		e.preventDefault();
		await db.users.add(user);
		setUsers(getUserList(db));
		clearData(setUser, order);
	};

function clearData(setUser, order) {
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
		firstMetVal: "",
		lastSpoke: "",
		lastSpokeVal: "",
		notes: "",
		order: order
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

async function exportData(db) {
	const data = await db.table("users").toArray();

	const handle = await getNewFileHandle();

	if (handle) {
		const writable = await handle.createWritable();

		await writable.write(JSON.stringify(data, null, 2));
		await writable.close();
	}
}

import React, { useState } from "react";

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

	function clearData() {
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

	function handleChange(e) {
		const field = e.target.name;
		let value = e.target.value;

		if (e.target.type === "number") {
			value = parseInt(e.target.value);
		} else if (e.target.type === "date") {
			const dateObj = new Date(e.target.value);

			user[`${field}Str`] = value;

			value = dateObj.getTime();
			console.log(value);
		}

		setUser({ ...user, [field]: value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		db.users.add(user);
		refresh();
		clearData();
	}

	function search(e) {
		e.preventDefault();
		db.table("users").toArray().then(console.log);
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

	function exportData() {
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

	async function deleteUser(e) {
		await db.users.delete(parseInt(e.target.id));
		refresh();
	}

	function refresh() {
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

	refresh();

	return (
		<div>
			<table>
				<tbody>{users}</tbody>
			</table>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Name"
					name="name"
					onChange={handleChange}
					value={user.name}
				/>
				<br />
				<input
					type="text"
					placeholder="Other Names"
					name="pseudonyms"
					onChange={handleChange}
					value={user.pseudonyms}
				/>
				<br />
				<input
					type="number"
					placeholder="Age"
					name="age"
					onChange={handleChange}
					value={user.age}
				/>
				<br />
				<input
					type="number"
					placeholder="Birth Day"
					name="birthDay"
					onChange={handleChange}
					max="31"
					min="1"
					value={user.birthDay}
				/>
				<input
					type="number"
					placeholder="Birth Month"
					name="birthMonth"
					onChange={handleChange}
					max="12"
					min="1"
					value={user.birthMonth}
				/>
				<br />
				<input
					type="text"
					placeholder="Religion"
					name="religion"
					onChange={handleChange}
					value={user.religion}
				/>
				<br />
				<input
					type="text"
					placeholder="Nationality"
					name="nationality"
					onChange={handleChange}
					value={user.nationality}
				/>
				<br />
				<input
					type="text"
					placeholder="Heritage"
					name="heritage"
					onChange={handleChange}
					value={user.heritage}
				/>
				<br />
				<label htmlFor="firstMet">First Met: </label>
				<input
					type="date"
					name="firstMet"
					onChange={handleChange}
					value={user.firstMetStr}
				/>
				<br />
				<label htmlFor="lastSpoke">Last Spoke: </label>
				<input
					type="date"
					name="lastSpoke"
					onInput={handleChange}
					value={user.lastSpokeStr}
				/>
				<br />
				<textarea
					placeholder="Notes"
					name="notes"
					onChange={handleChange}
					value={user.notes}
				/>
				<br />
				<input type="submit" value="Submit" />
			</form>
			<button onClick={search}>Search</button>
			<button onClick={exportData}>Export</button>
		</div>
	);
}

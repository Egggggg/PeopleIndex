import React, { useState } from "react";

export default function Form({ db }) {
	const [user, setUser] = useState({
		name: "",
		age: -1,
		birthDay: 0,
		birthMonth: 0,
		pseudonyms: "",
		firstMet: 0,
		lastSpoke: 0
	});

	function clearData() {
		setUser({
			name: "",
			age: -1,
			birthDay: 0,
			birthMonth: 0,
			pseudonyms: "",
			firstMet: 0,
			lastSpoke: 0
		});
	}

	function handleChange(e) {
		const field = e.target.name;
		let value = e.target.value;

		if (e.target.type === "number") {
			value = parseInt(e.target.value);
		} else if (e.target.type === "date") {
			const dateObj = new Date(e.target.value);

			value = dateObj.getTime();
			console.log(value);
		}

		setUser({ ...user, [field]: value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		db.users.add(user);
		clearData();
	}

	function search(e) {
		e.preventDefault();
		db.table("users").toArray().then(console.log);
	}

	async function getNewFileHandle() {
		const options = {
			types: [
				{
					description: "JSON Files",
					accept: {
						"text/plain": [".json"]
					}
				}
			]
		};

		const handle = await window.showSaveFilePicker(options);
		return handle;
	}

	function exportData() {
		db.table("users")
			.toArray()
			.then(async (data) => {
				const handle = await getNewFileHandle();
				const writable = await handle.createWritable();

				await writable.write(JSON.stringify(data, null, 2));
				await writable.close();
			});
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Name"
					name="name"
					onChange={handleChange}
				/>
				<br />
				<input
					type="text"
					placeholder="Other Names"
					name="pseudonyms"
					onChange={handleChange}
				/>
				<br />
				<input
					type="number"
					placeholder="Age"
					name="age"
					onChange={handleChange}
				/>
				<br />
				<input
					type="number"
					placeholder="Birth Day"
					name="birthDay"
					onChange={handleChange}
				/>
				<input
					type="number"
					placeholder="Birth Month"
					name="birthMonth"
					onChange={handleChange}
				/>
				<br />
				<input
					type="text"
					placeholder="Religion"
					name="religion"
					onChange={handleChange}
				/>
				<br />
				<input
					type="text"
					placeholder="Nationality"
					name="nationality"
					onChange={handleChange}
				/>
				<br />
				<input
					type="text"
					placeholder="Heritage"
					name="heritage"
					onChange={handleChange}
				/>
				<br />
				<label htmlFor="firstMet">First Met: </label>
				<input type="date" name="firstMet" onChange={handleChange} />
				<br />
				<label htmlFor="lastSpoke">Last Spoke: </label>
				<input type="date" name="lastSpoke" onInput={handleChange} />
				<br />
				<textarea placeholder="Notes" name="notes" onChange={handleChange} />
				<br />
				<input type="submit" value="Submit" />
			</form>
			<button onClick={search}>Search</button>
			<button onClick={exportData}>Export</button>
		</div>
	);
}

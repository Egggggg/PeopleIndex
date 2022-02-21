import { NavLink } from "react-router-dom";

const dateOptions = {
	timeZone: "UTC",
	month: "numeric",
	day: "numeric",
	year: "numeric"
};

const classes = {
	link: "list-group-item list-group-item-action py-3 lh-tight",
	div: "d-flex w-100 align-items-center justify-content-between"
};

export async function getUserList(db) {
	const now = Date.now();
	const data = await db.users.toArray();

	const users = data.map((user) => {
		let showLastSpoke = true;
		let sinceSpoke;
		let lastSpoke;

		if (user.lastSpoke === "" || isNaN(user.lastSpoke)) {
			showLastSpoke = false;
		} else {
			sinceSpoke = now - user.lastSpoke;
			sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

			lastSpoke = new Date(user.lastSpoke);
			lastSpoke = lastSpoke.toLocaleDateString(undefined, dateOptions);
		}

		return (
			<NavLink key={user.id} to={`/${user.id}`} className={classes.link}>
				<div className={classes.div}>
					<strong>{user.name}</strong>
					{showLastSpoke && (
						<small>{`${lastSpoke} - ${sinceSpoke}d ago`}</small>
					)}
				</div>
			</NavLink>
		);
	});

	return users;
}

function deleteUser(setUsers, db, userid) {
	return async (e) => {
		await db.users.delete(parseInt(userid));
		setUsers(await getUserList(db));
	};
}

export async function selectUser(db, userId, order) {
	const userData = await db.users.get(parseInt(userId));

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

	return userData;
}

export function getDefaultFields(order) {
	return {
		name: "",
		pronouns: "",
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
	};
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

export function exportData(db) {
	return async (e) => {
		const data = await db.users.toArray();

		const handle = await getNewFileHandle();

		if (handle) {
			const writable = await handle.createWritable();

			await writable.write(JSON.stringify(data, null, 2));
			await writable.close();
		}
	};
}

export function getDefaultForm(handleSubmit, handleChange, user) {
	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label for="name">
					<h3>Name</h3>
				</label>
				<input
					className="form-control"
					type="text"
					placeholder="Name"
					name="name"
					onChange={handleChange}
					value={user.name}
				/>
				<hr />
				<label for="pronouns">
					<h3>Pronouns</h3>
				</label>
				<input
					className="form-control"
					type="text"
					placeholder="Pronouns"
					name="pronouns"
					onChange={handleChange}
					value={user.pronouns}
				/>
				<hr />
				<label for="pseudonyms">
					<h3>Other Names</h3>
				</label>
				<input
					className="form-control"
					type="text"
					placeholder="Other Names"
					name="pseudonyms"
					onChange={handleChange}
					value={user.pseudonyms}
				/>
				<hr />
				<label for="age">
					<h3>Age</h3>
				</label>
				<input
					className="form-control"
					type="number"
					placeholder="Age"
					name="age"
					onChange={handleChange}
					value={user.age}
				/>
				<hr />
				<div className="row">
					<div className="col">
						<label for="birthDay">
							<h3>Birth Day</h3>
						</label>
						<input
							className="form-control"
							type="number"
							placeholder="Birth Day"
							name="birthDay"
							onChange={handleChange}
							max="31"
							min="1"
							value={user.birthDay}
						/>
					</div>
					<div className="col">
						<label for="birthMonth">
							<h3>Birth Month</h3>
						</label>
						<input
							className="form-control"
							type="number"
							placeholder="Birth Month"
							name="birthMonth"
							onChange={handleChange}
							max="12"
							min="1"
							value={user.birthMonth}
						/>
					</div>
				</div>
				<hr />
				<label for="religion">
					<h3>Religion</h3>
				</label>
				<input
					className="form-control"
					type="text"
					placeholder="Religion"
					name="religion"
					onChange={handleChange}
					value={user.religion}
				/>
				<hr />
				<label for="nationality">
					<h3>Nationality</h3>
				</label>
				<input
					className="form-control"
					type="text"
					placeholder="Nationality"
					name="nationality"
					onChange={handleChange}
					value={user.nationality}
				/>
				<hr />
				<label for="heritage">
					<h3>Heritage</h3>
				</label>
				<input
					className="form-control"
					type="text"
					placeholder="Heritage"
					name="heritage"
					onChange={handleChange}
					value={user.heritage}
				/>
				<hr />
				<label for="firstMet">
					<h3>First Met</h3>
				</label>
				<input
					className="form-control"
					type="date"
					name="firstMet"
					onChange={handleChange}
					value={user.firstMetVal}
				/>
				<hr />
				<label for="lastSpoke">
					<h3>Last Spoke</h3>
				</label>
				<input
					className="form-control"
					type="date"
					name="lastSpoke"
					onInput={handleChange}
					value={user.lastSpokeVal}
				/>
				<hr />
				<label for="name">
					<h3>Notes</h3>
				</label>
				<textarea
					className="form-control"
					placeholder="Notes"
					name="notes"
					onChange={handleChange}
					value={user.notes}
				/>
				<hr />
				<input type="submit" value="Submit" />
				<div style={{ height: "50px" }}></div>
			</form>
		</div>
	);
}

export function handleChange(user, setUser) {
	return (e) => {
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
}

export function handleSubmit(db, user, setUsers, redirect) {
	return async (e) => {
		e.preventDefault();
		await db.users.add(user);
		setUsers(await getUserList(db));
		redirect();
	};
}

export function handleUpdate(db, user, setUsers, redirect) {
	return async (e) => {
		e.preventDefault();
		await db.users.put(user);
		setUsers(await getUserList(db));
		redirect();
	};
}

export async function getUser(db, userId) {
	return await db.users.get(parseInt(userId));
}

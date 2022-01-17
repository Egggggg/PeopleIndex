const dateOptions = {
	timeZone: "UTC",
	month: "numeric",
	day: "numeric",
	year: "numeric"
};

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

export function refresh(setUsers, db) {
	return async () => {
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
						<a href={`/${user.id}`}>{user.name}</a>
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
}

function deleteUser(setUsers, db, userid) {
	return async (e) => {
		await db.users.delete(parseInt(userid));
		refresh(setUsers, db);
	};
}

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

			userData.firstMetStr = firstMet.toLocaleDateString(
				undefined,
				dateOptions
			);
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
}

function deleteUser(setUsers, db, userid) {
	return async (e) => {
		await db.users.delete(parseInt(userid));
		refresh(setUsers, db);
	};
}

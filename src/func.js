import { createPortal } from "react-dom";
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

export async function getUserList(db) {
	const now = Date.now();
	const data = await db.users.toArray();

	const users = data.map((user) => {
		let sinceSpoke = now - user.lastSpoke;

		sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

		let lastSpoke = new Date(user.lastSpoke);

		lastSpoke = lastSpoke.toLocaleDateString(undefined, dateOptions);

		return createPortal(
			<NavLink key={user.id} to={`/${user.id}`} className={classes.link}>
				<div className={classes.div}>
					<strong>{user.name}</strong>
					<small>{`${lastSpoke} - ${sinceSpoke}d`}</small>
				</div>
			</NavLink>,
			document.getElementById("side")
		);
	});

	return users;
}

function deleteUser(setUsers, db, userid) {
	return async (e) => {
		await db.users.delete(parseInt(userid));
		refresh(setUsers, db);
	};
}

export async function selectUser(db, userId, setUser) {
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

	return userData;
}

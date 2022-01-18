import { createPortal } from "react-dom";
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
		let sinceSpoke = now - user.lastSpoke;

		sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

		let lastSpoke = new Date(user.lastSpoke);

		lastSpoke = lastSpoke.toLocaleDateString(undefined, dateOptions);

		return (
			<NavLink key={user.id} to={`/${user.id}`} className={classes.link}>
				<div className={classes.div}>
					<strong>{user.name}</strong>
					<small>{`${lastSpoke} - ${sinceSpoke}d ago`}</small>
				</div>
			</NavLink>
		);
	});

	return users;
}

function deleteUser(setUsers, db, userid) {
	return async (e) => {
		await db.users.delete(parseInt(userid));
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
	return (
		async (e) => {
			const data = await db.users.toArray();

			const handle = await getNewFileHandle();

			if (handle) {
				const writable = await handle.createWritable();

				await writable.write(JSON.stringify(data, null, 2));
				await writable.close();
			}
		}
	);
};

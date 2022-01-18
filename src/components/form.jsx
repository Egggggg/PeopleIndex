import { useState } from "react";
import { getDefaultFields, getDefaultForm, getUserList } from "../func";

export default function Form({ db, setusers, order }) {
	const [user, setUser] = useState(getDefaultFields(order));

	return getDefaultForm(
		handleSubmit(db, user, setUser, setusers, getUserList, order),
		handleChange(user, setUser),
		user
	);
}

function handleChange(user, setUser) {
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

function handleSubmit(db, user, setUser, setUsers, getUserList, order) {
	return async (e) => {
		e.preventDefault();
		await db.users.add(user);
		setUsers(getUserList(db));
		clearData(setUser, order);
	};
}

function clearData(setUser, order) {
	setUser(getDefaultFields(order));
}

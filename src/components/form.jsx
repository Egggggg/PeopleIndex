import { useState } from "react";
import {
	handleSubmit,
	handleChange,

export default function Form({ db, setusers, order }) {
	const [user, setUser] = useState(getDefaultFields(order));

	return getDefaultForm(
		handleSubmit(db, user, setUser, setusers, getUserList, order),
		handleChange(user, setUser),
		user
	);
}

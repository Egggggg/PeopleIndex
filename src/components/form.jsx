import { useState } from "react";
import {
	handleSubmit,
	handleChange,
	getDefaultFields,
	getDefaultForm
} from "../func";

export default function Form({ db, setusers, order }) {
	const [user, setUser] = useState(getDefaultFields(order));

	return getDefaultForm(
		handleSubmit(db, user, setUser, setusers, order),
		handleChange(user, setUser),
		user
	);
}

import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import {
	handleUpdate,
	handleChange,
	getDefaultForm,
	getUser,
	getDefaultFields
} from "../func";

export default function UserEditor({ db, setusers, order }) {
	const userId = useParams().id;
	const [user, setUser] = useState(getDefaultFields(order));
	const [redirect, setRedirect] = useState(false);
	const [form, setForm] = useState(null);

	useEffect(() => {
		getUser(db, userId).then((result) => {
			setUser(result);
		});
	}, [db, userId]);

	useEffect(() => {
		setForm(
			getDefaultForm(
				handleUpdate(db, user, setUser, setusers, order, () =>
					setRedirect(true)
				),
				handleChange(user, setUser),
				user
			)
		);
	}, [db, order, setusers, user]);

	return (
		<>
			{redirect && <Navigate to="/" />}
			{form}
		</>
	);
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleSubmit, handleChange, getDefaultForm } from "../func";

export default function UserEditor({ db, setusers, order }) {
	const [user, setUser] = useState();
	const userId = useParams().userId;

	useEffect(() => {
		async function dbGetProxy() {
			return await db.users.get(parseInt(userId));
		}

		setUser(dbGetProxy());
	}, [db, userId]);

	console.log(user);

	return getDefaultForm(
		handleSubmit(db, user, setUser, setusers, order),
		handleChange(user, setUser),
		user
	);
}

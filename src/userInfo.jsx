import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { selectUser } from "./func";

export default function UserInfo({ db, order }) {
	const [user, setUser] = useState({});
	const userId = useParams().id;

	useEffect(() => {
		async function setUserAsync() {
			setUser(await selectUser(db, userId, order));
		}

		setUserAsync();
	}, [userId, db, order]);

	if (Object.keys(user).length === 0) {
		return <div></div>;
	}

	const fields = user.order.map((field) => {
		const [slug, fieldDisplay] = field.split(":::::");

		if (!user[slug]) {
			return <div key={slug}></div>;
		} else {
			return (
				<div key={slug}>
					<h3>{fieldDisplay}</h3>
					<p>{user[slug]}</p>
				</div>
			);
		}
	});

	return fields;
}

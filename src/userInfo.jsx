import React, { useState, useParams, useEffect } from "react";
import { selectUser } from "./func";

export default function UserInfo() {
	const [user, setUser] = useState({});
	const userId = useParams().id;

	useEffect(() => {
		async function setUserAsync() {
			setUser(await selectUser(userId));
		}

		setUserAsync();
	}, [userId]);

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

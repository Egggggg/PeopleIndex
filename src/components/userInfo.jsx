import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { selectUser } from "../func";

export default function UserInfo({ db, order }) {
	const [user, setUser] = useState({});
	const userId = useParams().id;

	useEffect(() => {
		async function setUserAsync() {
			setUser(await selectUser(db, userId, order));
		}

		setUserAsync();
	}, [userId, db, order]);

	if (!user || Object.keys(user).length === 0) {
		return <h3 className="text-center">User not found</h3>;
	}

	const fields = user.order.map((field) => {
		const { slug, display } = field;

		if (!user[slug]) {
			return <div key={slug}></div>;
		} else {
			return (
				<div key={slug}>
					<h3>{display}</h3>
					<p>{user[slug]}</p>
					<hr />
				</div>
			);
		}
	});

	return (
		<div>
			{fields}
			<NavLink to={`/edit/${userId}`}>Edit</NavLink>
		</div>
	);
}

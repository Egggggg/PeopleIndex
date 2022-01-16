import React from "react";

export default function UserInfo({ user }) {
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

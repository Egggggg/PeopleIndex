import { useEffect, useState } from "react";

export default function UserList({ db }) {
	const [results, setResults] = useState([]);

	useEffect(() => {
		db.users.toArray().then((users) => {
			setResults(users);
		});
	}, [db.users]);

	let users = results.map((user) => {
		const now = Date.now();
		let sinceSpoke = now - user.lastSpoke;

		sinceSpoke = Math.floor(sinceSpoke / (1000 * 3600 * 24));

		let lastSpoke = new Date(user.lastSpoke);

		lastSpoke = `${
			lastSpoke.getMonth() + 1
		}-${lastSpoke.getDate()}-${lastSpoke.getFullYear()}`;

		return (
			<tr key={user.id}>
				<td id={`name-${user.id}`}>{user.name}</td>
				<td id={`since-${user.id}`}>{sinceSpoke}</td>
				<td id={`last-${user.id}`}>{lastSpoke}</td>
			</tr>
		);
	});

	return (
		<table>
			<tbody>{users}</tbody>
		</table>
	);
}

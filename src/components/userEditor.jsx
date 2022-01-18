import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserEditor({ db }) {
	const [user, setUser] = useState();
	const userId = useParams().userId;

	useEffect(() => {
		async function dbGetProxy() {
			return await db.users.get(parseInt(userId));
		}

		setUser(dbGetProxy());
	}, [db, userId]);
}

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { getUserList } from "../func";

export default function UserList({ db, users, setUsers }) {
	useEffect(() => {
		async function getUserListProxy() {
			setUsers(await getUserList(db));
		}

		getUserListProxy();
	}, [db, setUsers, users]);

	if (!users || users.length === 0) {
		return <div></div>;
	}

	return createPortal(users, document.getElementById("side"));
}

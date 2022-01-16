import React, { useEffect, useState } from "react";

export default function UserList(props) {
	useEffect(() => {
		props.refresh(props.setUsers, props.db);
	}, [props]);

	return (
		<table>
			<tbody>{props.users}</tbody>
		</table>
	);
}

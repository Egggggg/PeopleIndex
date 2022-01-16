import React, { useEffect } from "react";

export default function UserList(props) {
	useEffect(() => {
		props.refresh();
	}, [props]);

	return (
		<table>
			<tbody>{props.users}</tbody>
		</table>
	);
}

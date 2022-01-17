import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserInfo from "./userInfo";
import UserList from "./userList";
import Form from "./form";

const order = [
	"name:::::Name",
	"pseudonyms:::::Other Names",
	"age:::::Age",
	"birthDate:::::Birthday",
	"religion:::::Religion",
	"nationality:::::Nationality",
	"heritage:::::Heritage",
	"firstMetStr:::::First Met",
	"lastSpokeStr:::::Last Spoke",
	"notes:::::Notes"
];

export default function App({ db }) {
	const [users, setUsers] = useState([]);

	return (
		<BrowserRouter>
			<UserList db={db} users={users} setUsers={setUsers} />
			<Routes>
				<Route
					index
					element={
						<div className="text-center mt-3">
							<h1>People Index</h1>
							<h3>Know your people.</h3>
						</div>
					}
				></Route>
				<Route
					path="add"
					element={
						<Form db={db} users={users} setusers={setUsers} order={order} />
					}
				></Route>
				<Route path=":id" element={<UserInfo order={order} db={db} />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

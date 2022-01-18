import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserInfo from "./userInfo";
import UserList from "./userList";
import UserEditor from "./userEditor";
import Form from "./form";
import Navbar from "./navbar";

const order = [
	{
		slug: "name",
		display: "Name"
	},
	{
		slug: "pronouns",
		display: "Pronouns"
	},
	{
		slug: "pseudonyms",
		display: "Other Names"
	},
	{
		slug: "age",
		display: "Age"
	},
	{
		slug: "birthDate",
		display: "Birthday"
	},
	{
		slug: "religion",
		display: "Religion"
	},
	{
		slug: "nationality",
		display: "Nationality"
	},
	{
		slug: "heritage",
		display: "Heritage"
	},
	{
		slug: "firstMetStr",
		display: "First Met"
	},
	{
		slug: "lastSpokeStr",
		display: "Last Spoke"
	},
	{
		slug: "notes",
		display: "Notes"
	}
];

export default function App({ db }) {
	const [users, setUsers] = useState([]);

	return (
		<BrowserRouter>
			<Navbar />
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
				<Route path="edit/:id" element={<UserEditor db={db} />}></Route>
				<Route path=":id" element={<UserInfo order={order} db={db} />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

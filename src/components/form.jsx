import { useState } from "react";
import { Navigate } from "react-router";

import {
	handleSubmit,
	handleChange,
	getDefaultFields,
	getDefaultForm
} from "../func";

export default function Form({ db, setusers, order }) {
	const [user, setUser] = useState(getDefaultFields(order));
	const [redirect, setRedirect] = useState(false);

			{redirect && <Navigate to="/" />}
	);
}

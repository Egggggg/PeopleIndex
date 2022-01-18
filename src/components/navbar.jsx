import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";

export default function Navbar() {
	return createPortal(
		<NavLink className="navbar-brand" to="/">
			Navbar
		</NavLink>,
		document.getElementById("navbar")
	);
}

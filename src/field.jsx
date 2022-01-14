export default function Field(props) {
	const val = [];

	if (props.label) {
		val.push(
			<label htmlFor={props.name} key="label">
				{props.label}
			</label>
		);
	}

	if (props.type !== "textarea") {
		val.push(
			<input
				type={props.type}
				placeholder={props.placeholder}
				name={props.name}
				onChange={props.handleChange(props.user, props.setUser)}
				value={props.value}
				min={props.min}
				max={props.max}
				key="input"
			/>
		);
	} else {
		val.push(
			<textarea
				placeholder={props.placeholder}
				name={props.name}
				onChange={props.handleChange(props.user, props.setUser)}
				value={props.value}
				key="input"
			/>
		);
	}

	if (props.br) {
		val.push(<br key="br" />);
	}

	return val;
}

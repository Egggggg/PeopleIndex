export default function Field(props) {
	const val = [];

	if (props.label) {
		val.push(
			<label htmlFor={props.name} key="label">
				{props.label}
			</label>
		);
	}

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

	if (props.br) {
		val.push(<br key="br" />);
	}

	return val;
}

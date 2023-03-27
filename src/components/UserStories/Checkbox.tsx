import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as SendIcon } from '../../images/icon-send.svg';

const Checkbox = ({ features, handleSystemFeatures }) => {
	const [input, setInput] = useState('');

	const handleChange = (event) => {
		setInput(event.target.value);
	};

	const [checkedValues, setCheckedValues] = useState([]);

	// Define an array of checkbox values
	const checkboxValues = features.map((x) => {
		return { label: x, value: x };
	});

	// Handle checkbox change event
	const handleCheckboxChange = (event) => {
		// Get the checked value
		const checkedValue = event.target.value;

		// If the checkbox is checked, add the value to the array
		if (event.target.checked) {
			setCheckedValues([...checkedValues, checkedValue]);
		} else {
			// If the checkbox is unchecked, remove the value from the array
			setCheckedValues(checkedValues.filter((value) => value !== checkedValue));
		}
	};

	const combinedString = checkedValues
		.reduce((acc, currentValue) => {
			const matchedCheckbox = checkboxValues.find((checkbox) => checkbox.value === currentValue);
			if (matchedCheckbox) {
				acc.push(matchedCheckbox.label);
			}
			return acc;
		}, [])
		.join(', ');

	return (
		<div>
			{checkboxValues.map((checkbox) => (
				<div key={checkbox.value} style={{ textAlign: 'left' }}>
					<input type='checkbox' className='form-check-input' id={checkbox.value} value={checkbox.value} checked={checkedValues.includes(checkbox.value)} onChange={handleCheckboxChange} />
					<label htmlFor={checkbox.value}>{checkbox.label}</label>
				</div>
			))}
			<div className='text-end'>
				<button onClick={() => handleSystemFeatures(combinedString)} className='btn btn-success mt-3'>
					Submit
				</button>
			</div>
		</div>
	);
};

export default Checkbox;

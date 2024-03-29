import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as SendIcon } from "../../images/icon-send.svg";

interface Props {
  features: string[];
  handleTableFeatures: (features: string) => Promise<void>;
}

const Checkbox: React.FC<Props> = ({ features, handleTableFeatures }) => {
  const [input, setInput] = useState("");

  const handleChange = (event: { target: HTMLInputElement }) => {
    setInput(event.target.value);
  };

  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  // Define an array of checkbox values
  const checkboxValues: { value: string; label: string }[] = features.map(
    (x) => {
      return { label: x, value: x };
    }
  );

  // Handle checkbox change event
  const handleCheckboxChange = (event: {
    target: { value: any; checked: any };
  }) => {
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

  const combinedString: string = checkedValues
    .reduce((acc: string[], currentValue: string) => {
      const matchedCheckbox = checkboxValues.find(
        (checkbox) => checkbox.value === currentValue
      );
      if (matchedCheckbox) {
        acc.push(matchedCheckbox.label);
      }
      return acc;
    }, [])
    .join(", ");

  return (
    <div className="w-100 p-4">
      <h4 className="text-center mb-4">Select queries to be generated</h4>
      <div className="border rounded p-3">
        {checkboxValues.map((checkbox) => (
          <div key={checkbox.value} style={{ textAlign: "left" }} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              style={{fontSize: "20px"}}
              id={checkbox.value}
              value={checkbox.value}
              checked={checkedValues.includes(checkbox.value)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={checkbox.value} style={{fontSize: "20px"}}>{checkbox.label}</label>
          </div>
        ))}
      </div>
      <div className="text-end pt-4">
        <button
          className="btn btn-success"
          onClick={() => {
            handleTableFeatures(combinedString);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Checkbox;

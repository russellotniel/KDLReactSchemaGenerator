import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as SendIcon } from "../../images/icon-send.svg";

interface Props {
  features: string[];
  handleSystemFeatures: (features: string) => Promise<void>;
}

const Checkbox: React.FC<Props> = ({ features, handleSystemFeatures }) => {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  // Define an array of checkbox values
  const checkboxValues = features.map((x) => {
    return { label: x, value: x };
  });

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
    <div>
      <div className="border rounded p-3">
        {checkboxValues.map((checkbox) => (
          <div key={checkbox.value} style={{ textAlign: "left" }} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={checkbox.value}
              style={{fontSize: "20px"}}
              value={checkbox.value}
              checked={checkedValues.includes(checkbox.value)}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" style={{fontSize: "20px"}} htmlFor={checkbox.value}>{checkbox.label}</label>
          </div>
        ))}
      </div>
      <div className="text-end">
        <button
          onClick={() => handleSystemFeatures(combinedString)}
          className="btn btn-success mt-3"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Checkbox;

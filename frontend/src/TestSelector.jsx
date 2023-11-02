
import React from "react";
import { TEST_TO_PORT_MAPPING } from "./constants";

const TestSelector = ({ value, onChange, isLoading }) => (
  <div className="SelectorContainer">
    <label className="Label" htmlFor="testSelector">
      Seleccione un test:{" "}
    </label>
    <select className="Select" id="testSelector" value={value} onChange={onChange} disabled={isLoading}>
      {Object.keys(TEST_TO_PORT_MAPPING).map((test) => (
        <option key={test} value={test}>
          {test}
        </option>
      ))}
    </select>
  </div>
);

export default TestSelector;

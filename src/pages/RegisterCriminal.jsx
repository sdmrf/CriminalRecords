import React, { useState } from "react";
import { getContract } from "../ApiFeature";

const RegisterCriminal = () => {
  const [inputs, setInputs] = useState({
    criminalId: "",
    personalInfo: "",
    mugshots: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleMugshotsChange = (event) => {
    const { value } = event.target;
    const mugshots = value.split(",");
    console.log(mugshots);
    setInputs({
      ...inputs,
      mugshots,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contract = await getContract();
    const { criminalId, personalInfo, mugshots } = inputs;
    await contract.registerCriminal(criminalId, personalInfo, mugshots);
    alert("Criminal Registered");
  };

  return (
    <div className="RegisterCriminal">
      <h1>Criminal Records</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Criminal Id
          <input
            type="text"
            name="criminalId"
            value={inputs.criminalId}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Criminal Personal Info
          <input
            type="text"
            name="personalInfo"
            value={inputs.personalInfo}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Criminal Mugshots
          <input
            type="text"
            name="mugshots"
            onChange={handleMugshotsChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterCriminal;

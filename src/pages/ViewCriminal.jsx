import "./Criminal.scss";
import { useState } from "react";
import { getContract } from "../ApiFeature";

const ViewCriminal = () => {
  const [criminalId, setCriminalId] = useState("");
  const [criminal, setCriminal] = useState(null);
  const handleChange = (event) => {
    const { value } = event.target;
    setCriminalId(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contract = await getContract();
    const criminal = await contract.viewCriminal(criminalId);
    setCriminal(criminal);
  };

  return (
    <div className="ViewCriminal">
      <h1>View Criminal Record</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Criminal Id
          <input
            type="text"
            name="criminalId"
            value={criminalId}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Fetch Criminal</button>
      </form>
      <div className="View">
        <div className="CriminalId">
          <h1>Criminal ID</h1>
          <span>{criminal ? criminal[0] : "1"}</span>
        </div>
        <div className="PersonalInfo">
          <h1>Personal Info</h1>
          <span>{criminal ? criminal[1] : "1"}</span>
        </div>
        <div className="Mugshots">
          <h1>Mugshots</h1>
          {criminal && criminal[2] ? (
            criminal[2].map((mugshot, index) => (
              <img
                key={index}
                src={`https://ipfs.io/ipfs/${mugshot}`}
                alt={`mugshot-${index}`}
              />
            ))
          ) : (
            <span>No Mugshots</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCriminal;

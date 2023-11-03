import { useState } from "react";
import { getContract } from "../../ApiFeature";

const EnterCriminalId = ({setCriminal}) => {
    const [criminalId, setCriminalId] = useState("");
    const handleChange = (event) => {
        const { value } = event.target;
        setCriminalId(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const contract = await getContract();
            const criminal = await contract.viewCriminal(criminalId);
            setCriminal(criminal);
        } catch (error) {
            console.log(error);
            alert("Criminal Id not found");
        }
    }
  return (
    <div className="EnterCriminalId">
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
    </div>
  )
}

export default EnterCriminalId
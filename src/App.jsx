import "./App.scss";
import { useState } from "react";

const App = () => {
  const [walletConnected, setWalletConnected] = useState(true);
  return (
    <div className="App">
      {!walletConnected ? (
        <div className="Connect">
          <button>Connect Wallet</button>
        </div>
      ) : (
        <div className="CriminalRecords">
          <h1>Criminal Records</h1>
          <form action="">
            <label>
              Criminal Id
              <input type="text" name="criminalId" required />
            </label>
            <label>
              Criminal Personal Info
              <input type="text" name="personalInfo" required />
            </label>
            <label>
              Criminal Mugshots
              <input type="file" name="mugshots" title="Upload" className="Upload" required />
            </label>
            <button>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;

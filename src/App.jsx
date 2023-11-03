import { useState } from "react";
import { getSigner } from "./ApiFeature";

import RegisterCriminal from "./pages/Register Criminal/RegisterCriminal";
import ViewCriminal from "./pages/View Criminal/ViewCriminal";
import IdentifyCriminal from './pages/Identify Criminal/IdentifyCriminal';

import "./App.scss";

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [flag, setFlag] = useState(null);

  const connectWallet = async () => {
    try {
      const signer = await getSigner();

      if (signer) {
        // You are connected to the wallet
        setWalletConnected(true);
      } else {
        alert("Please install MetaMask");
      }
    } catch (error) {
      console.error("Error connecting to wallet: ", error);
    }
  };

  return (
    <div className="App">
      {!walletConnected ? (
        <div className="Connect">
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        {
          1: <IdentifyCriminal />,
          2: <RegisterCriminal />,
          3: <ViewCriminal />,
        }[flag] || (
          <div className="Cards">
            <div className="Card" onClick={() => setFlag(1)}>
              <h1>Identify Criminal</h1>
            </div>
            <div className="Card" onClick={() => setFlag(2)}>
              <h1>Register Criminal</h1>
            </div>
            <div className="Card" onClick={() => setFlag(3)}>
              <h1>View Criminal</h1>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default App;

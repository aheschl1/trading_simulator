import "./App.css";
import BankingInfo from "./banking/BankingInfo";
import MarketOverview from "./market/MarketOverview";

function App() {
  // I wish to split the screen into two components.
  // A top portion will display banking info (which we will define in a new file)
  // The bottom half will display the stock market (which we will define in a new file)

  return (
    <div className="app-container">
      <div className="top-section">
        <BankingInfo />
      </div>
      <div className="bottom-section">
        <MarketOverview />
      </div>
    </div>
  );


}

export default App;

import "./App.css";
import BankingInfo from "./banking/BankingInfo";
import MarketOverview from "./market/MarketOverview";
import {AccountsProvider} from "./banking/context/AccountContext";
import { SimulatedDateProvider, useSimulatedDate } from "./contexts/SimulatedDateContext";
import { useEffect, useState } from "react";
import DigitalClock from "./widgets/Clock";
import { FavoritesProvider } from "./market/context/FavoritesContext";

function App() {
  return (
    <SimulatedDateProvider>
      <AccountsProvider>
      <div className="app-container">
        <div className="top-section">
          <DigitalClock/>
          <BankingInfo />
        </div>
        <div className="bottom-section">
          <FavoritesProvider>
            <MarketOverview />
          </FavoritesProvider>
        </div>
      </div>
      </AccountsProvider>
    </SimulatedDateProvider>
  );
}

export default App;

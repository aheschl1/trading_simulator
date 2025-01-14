import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./TickerOverview.css";
import TickerPopup from "./TickerPopup";
import TickerChart from "./TickerChart";
import { useTicker } from "../context/TickerContext";
import { Button, Dialog } from "@mui/material";
import { message } from '@tauri-apps/plugin-dialog';
import SelectAccountDialog from "../../banking/account_helpers/selectAccount";
import { useAccounts } from "../../banking/context/AccountContext";
import purchaseShares from "../trading/buyStock";
import { useSimulatedDate } from "../../contexts/SimulatedDateContext";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TickerOverview() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [isSelectingAccount, setIsSelectingAccount] = useState(false);
  const {selectedAccount, setSelectedAccount} = useAccounts();
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const {fetchAccounts} = useAccounts();
  let {simulatedDate} = useSimulatedDate()

  let {
    isLoading,
    hasError,
    symbol,
  } = useTicker();
  
  const purchase = async () => {
    if(selectedAccount === undefined){
      message("Please select an account.", {"title": "No Account Selected", "type": "error"});
      setIsSelectingAccount(true);
      return;
    }
    let purchaseQuantity = prompt("Enter the quantity you would like to purchase");
    purchaseQuantity = parseFloat(purchaseQuantity);
    if (isNaN(purchaseQuantity)) {
      alert("Invalid quantity");
      return;
    }
    if (purchaseQuantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }
    try{
      setLoadingPurchase(true);
      await purchaseShares(
        purchaseQuantity,
        symbol,
        selectedAccount.id,
        simulatedDate
      )
      fetchAccounts();
      message(`Purchased ${purchaseQuantity} shares of ${symbol}`, {"title": "Purchase Successful", "type": "info"});
    } catch (e) {
      message(`Failed to purchase shares: ${e}`, {"title": "Purchase Failed", "type": "error"});
    }finally{
      setLoadingPurchase(false);
    }
      
  }

  return (
    <div className="parent">
      {/* <h1>{symbol}</h1> */}
      <div className="header">
        <h1>{symbol}</h1>
        <Button variant="contained" color="primary" onClick={() => setPopupOpen(true)} style={{
          height: "min-content",
        }}>
          Expand
        </Button>
      </div>
      {/* Loading and Error Handling */}
      {isLoading && <p>Loading...</p>}
      {hasError && <p>Error loading data: {hasError}</p>}

      {/* Render Chart */}
      {!isLoading && !hasError && (
        <TickerChart/>
      )}
      {/* Popup */}
      <TickerPopup open={popupOpen} setOpen={setPopupOpen} purchase={purchase} loadingPurchase={loadingPurchase}/>
      {/* Purchase account select */}
      {
        isSelectingAccount && 
        <SelectAccountDialog open={isSelectingAccount} onClose={(account) => {
          setIsSelectingAccount(false);
          if (account) {
            setSelectedAccount(account);
          }
        }}/>
      }
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
import { useFavorites } from "../context/FavoritesContext";
import { Box, IconButton } from "@mui/material";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'; // Unpinned appearance

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
  const { selectedAccount, setSelectedAccount } = useAccounts();
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const { fetchAccounts } = useAccounts();
  const [purchasing, setPurchasing] = useState(false);
  let { removeFavorite } = useFavorites();
  let { simulatedDate } = useSimulatedDate()

  let {
    isLoading,
    hasError,
    symbol,
    companyProfile
  } = useTicker();


  useEffect(() => {
    if (!purchasing) {
      return;
    }
    if (selectedAccount === undefined) {
      setIsSelectingAccount(true);
      return;
    }
    purchase();
    setPurchasing(false);
  }, [purchasing, selectedAccount]);

  const purchase = async () => {
    if (selectedAccount === undefined) {
      message("Please select an account to purchase shares", { "title": "Select Account", "type": "info" });
      return;
    }
    // ensure it is an investment account
    if (selectedAccount.assets === undefined) {
      message("Please select an investment account to purchase shares", { "title": "Select Investment Account", "type": "info" });
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
    try {
      setLoadingPurchase(true);
      await purchaseShares(
        purchaseQuantity,
        symbol,
        selectedAccount.id,
        simulatedDate
      )
      fetchAccounts();
      message(`Purchased ${purchaseQuantity} shares of ${symbol}`, { "title": "Purchase Successful", "type": "info" });
    } catch (e) {
      message(`Failed to purchase shares: ${e}`, { "title": "Purchase Failed", "type": "error" });
    } finally {
      setLoadingPurchase(false);
    }

  }

  return (
    <div className="parent">
      {/* <h1>{symbol}</h1> */}
      <div className="header">
        <Box display="flex" alignItems="center">
          {
            companyProfile &&
            <img
              src={companyProfile.logo}
              alt={`${symbol} Logo`}
              style={{
                maxWidth: "50px",
                height: "auto",
                marginRight: "16px",
                borderRadius: "50%"
              }}
            />
          }
          <h1>{symbol}</h1>
        </Box>
        <Box display="flex" alignItems="end">
          <IconButton
            color="primary"
            onClick={() => setPopupOpen(true)}
            style={{
              height: "min-content",
            }}
          >
            <OpenInFullIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => {
              removeFavorite(symbol);
            }}
            style={{
              height: "min-content",
            }}
            aria-label="Unpin content" // Accessible label for screen readers
          >
            <PushPinOutlinedIcon />
          </IconButton>
        </Box>
      </div>
      {/* Loading and Error Handling */}
      {isLoading && <p>Loading...</p>}
      {hasError && <p>Error loading data: {hasError}</p>}

      {/* Render Chart */}
      {!isLoading && !hasError && (
        <TickerChart />
      )}
      {/* Popup */}
      <TickerPopup open={popupOpen} setOpen={setPopupOpen} purchase={() => {
        setPurchasing(true);
      }} loadingPurchase={loadingPurchase} />
      {/* Purchase account select */}
      {
        isSelectingAccount &&
        <SelectAccountDialog open={isSelectingAccount} onClose={(account) => {
          setIsSelectingAccount(false);
          if (account) {
            setSelectedAccount(account);
          }
        }} />
      }
    </div>
  );
}

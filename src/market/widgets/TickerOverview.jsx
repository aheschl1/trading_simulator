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
import { Button } from "@mui/material";

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
  let {
    isLoading,
    hasError,
    symbol,
  } = useTicker();
  
  const purchase = () => {

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
      <TickerPopup open={popupOpen} setOpen={setPopupOpen} purchase={purchase}/>
    </div>
  );
}

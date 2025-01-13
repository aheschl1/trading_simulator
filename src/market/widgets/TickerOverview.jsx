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
import { Line } from "react-chartjs-2";
import {
  getTimeSeriesIntraday,
  getTimeSeriesDailyFull,
  getTimeSeriesWeeklyFull,
  getTimeSeriesMonthlyFull,
  THIRTY_MINUTES,
} from "../hooks/useTimeSeries";
import "./TickerOverview.css";
import TickerPopup from "./TickerPopup";

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

export default function TickerOverview({ ticker }) {
  const [timeFrame, setTimeFrame] = useState("1d");
  const [chartData, setChartData] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // Fetch time series data based on the selected time frame
  const { data: intradayData, loading: intradayLoading, error: intradayError } = getTimeSeriesIntraday(
    ticker,
    THIRTY_MINUTES
  );
  const { data: dailyData, loading: dailyLoading, error: dailyError } = getTimeSeriesDailyFull(ticker);
  const { data: weeklyData, loading: weeklyLoading, error: weeklyError } = getTimeSeriesWeeklyFull(ticker);
  const { data: monthlyData, loading: monthlyLoading, error: monthlyError } = getTimeSeriesMonthlyFull(ticker);
  const timeSeries = {
    "1d": intradayLoading ? undefined : intradayData.entries,
    "1w": dailyLoading ? undefined : dailyData.entries.slice(-7),
    "1m": dailyLoading ? undefined : dailyData.entries.slice(-30),
    "3m": weeklyLoading ? undefined : weeklyData.entries.slice(-13),
    "1y": weeklyLoading ? undefined : weeklyData.entries.slice(-52),
    "5y": monthlyLoading ? undefined : monthlyData.entries.slice(-60),
  }[timeFrame];
  const isLoading =intradayLoading || dailyLoading || weeklyLoading || monthlyLoading;
  const hasError = intradayError || dailyError || weeklyError || monthlyError;

  useEffect(() => {
    if (timeSeries && !isLoading && !hasError) {
        console.log(Object.keys(timeSeries));
      setChartData({
        labels: timeSeries.map((entry) => new Date(entry.date).toLocaleString()),
        datasets: [
          {
            label: `${ticker} Stock Price`,
            data: timeSeries.map((entry) => entry.close),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      });
    }
  }, [isLoading, hasError, timeFrame]);

  return (
    <div className="parent">
      <h1>{ticker}</h1>
      {/* Loading and Error Handling */}
      {isLoading && <p>Loading...</p>}
      {hasError && <p>Error loading data: {hasError}</p>}

      {/* Render Chart */}
      {!isLoading && !hasError && chartData && (
        <div style={{ width: "100%", maxWidth: "800px", height: "100%", minHeight: "300px", margin: "0 auto" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              }
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                title: {
                  display: true,
                  text: "Stock Price (USD)",
                },
              },
            },
          }}
        />
      </div>
      )}
    
    <div style={{ marginBottom: "1rem" }}>
        {/* Timeframe Buttons */}
        {["1d", "1w", "1m", "3m", "1y", "5y"].map((frame) => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              backgroundColor: timeFrame === frame ? "#007bff" : "#e0e0e0",
              color: timeFrame === frame ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {frame.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setPopupOpen(true)}
          style={{
            margin: "0 5px",
            marginTop: "6px",
            padding: "8px 12px",
            backgroundColor: "#e0e0e0",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >Expand</button>
      </div>
      {/* Popup */}
      <TickerPopup open={popupOpen} setOpen={setPopupOpen} intradayData={intradayData} symbol={ticker}/>
    </div>
  );
}
